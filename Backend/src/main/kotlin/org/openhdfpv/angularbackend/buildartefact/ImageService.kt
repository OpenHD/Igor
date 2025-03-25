package org.openhdfpv.angularbackend.buildartefact

import org.openhdfpv.angularbackend.imager.ImageListService
import org.openhdfpv.angularbackend.oscategory.OsCategoryService
import org.openhdfpv.angularbackend.special.EntityNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class ImageService(
    private val buildImagesRepository: BuildImagesRepository,
    private val imageListService: ImageListService, // Instead of ImagesListRepository
    private val osCategoryService: OsCategoryService
) {

    fun handleRedirect(imageEntity: ImageEntity?): ResponseEntity<Any> =
        imageEntity?.let { entity ->
            // Increment the redirect count directly (instead of using copy())
            entity.redirectsCount = entity.redirectsCount + 1
            buildImagesRepository.save(entity)
            ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", entity.getCurrentAvailableUrl())
                .build()
        } ?: ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("ImageEntity not found.")

    fun findBySha256(sha256: String): ImageEntity? =
        buildImagesRepository.findByExtractSha256(sha256)

    fun findById(id: UUID): ImageEntity =
        buildImagesRepository.findById(id)
            .orElseThrow { EntityNotFoundException("ImageEntity with ID $id not found") }

    fun findAll(): List<ImageEntity> = buildImagesRepository.findAll()

    fun save(image: ImageEntity): ImageEntity =
        buildImagesRepository.save(image)

    fun delete(id: UUID) {
        val imageEntity = buildImagesRepository.findById(id)
            .orElseThrow { EntityNotFoundException("ImageEntity with ID $id not found") }
        // Set the isDeleted flag directly (instead of using copy())
        imageEntity.isDeleted = true
        buildImagesRepository.save(imageEntity)
    }

    fun addImageToImagesList(imageId: UUID, imagesListId: Long) {
        val imageEntity = findById(imageId)
        imageListService.addImageToImagesList(imagesListId, imageEntity)
    }

    fun removeImageFromImagesList(imageId: UUID, imagesListId: Long) {
        val imageEntity = findById(imageId)
        imageListService.removeImageFromImagesList(imagesListId, imageEntity)
    }

    fun updateImageCategory(imageId: UUID, categoryId: Long?): ImageEntity {
        val imageEntity = findById(imageId)
        val category = categoryId?.let { osCategoryService.findCategoryById(it) }
        // Directly set the new category value
        imageEntity.category = category
        return save(imageEntity)
    }

    fun findAllNonDeleted(): List<ImageEntity> = buildImagesRepository.findByIsDeletedFalse()

    @Throws(EntityNotFoundException::class)
    fun findByFilename(filename: String): ImageEntity {
        return buildImagesRepository.findByFilenameCustomQuery(filename)
            ?: throw EntityNotFoundException("Image with filename '$filename' not found")
    }

    fun handleRedirectByFilename(filename: String): ResponseEntity<Any> {
        return try {
            val imageEntity = findByFilename(filename)
            val redirectUrl = imageEntity.getUrlByFilename(filename)
                ?: throw NoUrlAvailableException("No available URL for filename '$filename'")
            // Increment the redirect count directly
            imageEntity.redirectsCount = imageEntity.redirectsCount + 1
            buildImagesRepository.save(imageEntity)
            ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .build()
        } catch (e: EntityNotFoundException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to e.message))
        } catch (e: NoUrlAvailableException) {
            ResponseEntity.status(HttpStatus.GONE)
                .body(mapOf("error" to e.message))
        }
    }

    fun deleteAll() = buildImagesRepository.deleteAll()

    fun saveFromDto(dto: ImageDTO): ImageEntity {
        val foundCategory = dto.categoryId?.let { osCategoryService.findCategoryById(it) }
        val savedImage = if (dto.id != null) {
            val existingImage = findById(dto.id)
            existingImage.apply {
                name = dto.name
                description = dto.description
                icon = dto.icon
                backupUrls = dto.backupUrls
                extractSize = dto.extractSize
                extractSha256 = dto.extractSha256
                imageDownloadSize = dto.imageDownloadSize
                isEnabled = dto.isEnabled
                urls = dto.urls.map { urlDto ->
                    ImageUrl(
                        url = urlDto.url,
                        isDefault = urlDto.isDefault
                    )
                }.toMutableList()
                category = foundCategory
            }
            save(existingImage)
        } else {
            val newImage = ImageEntity(
                name = dto.name,
                description = dto.description,
                icon = dto.icon,
                backupUrls = dto.backupUrls,
                extractSize = dto.extractSize,
                extractSha256 = dto.extractSha256,
                imageDownloadSize = dto.imageDownloadSize,
                urls = dto.urls.map { urlDto ->
                    ImageUrl(
                        url = urlDto.url,
                        isDefault = urlDto.isDefault
                    )
                }.toMutableList(),
                category = foundCategory,
                releaseDate = "", // Set default value
                initFormat = ""
            )
            save(newImage)
        }

        // Process imagesLists associations
        dto.imagesLists?.let { listIds ->
            val currentLists = imageListService.findImagesListsByImageId(savedImage.id!!)
            val newListIds = listIds.toSet()

            // Remove from old lists
            currentLists.filter { it !in newListIds }.forEach { listId ->
                imageListService.removeImageFromImagesList(listId, savedImage)
            }

            // Add to new lists
            newListIds.filter { it !in currentLists }.forEach { listId ->
                imageListService.addImageToImagesList(listId, savedImage)
            }
        }

        return savedImage
    }

    fun updateImagePartial(id: UUID, input: ImagePartialInput): ImageEntity {
        val existingImage = findById(id)

        // Update basic fields directly
        input.name?.let { existingImage.name = it }
        input.description?.let { existingImage.description = it }
        input.icon?.let { existingImage.icon = it }
        input.urls?.let { urls ->
            existingImage.urls = urls.map { ImageUrl(it.url, isDefault = it.isDefault) }.toMutableList()
        }
        input.backupUrls?.let { existingImage.backupUrls = it }
        input.extractSize?.let { existingImage.extractSize = it }
        input.extractSha256?.let { existingImage.extractSha256 = it }
        input.imageDownloadSize?.let { existingImage.imageDownloadSize = it }
        input.isEnabled?.let { existingImage.isEnabled = it }
        input.releaseDate?.let { existingImage.releaseDate = it }
        input.redirectsCount?.let { existingImage.redirectsCount = it }
        input.categoryId?.let {
            existingImage.category = osCategoryService.findCategoryById(it)
        }
        val updatedImage = save(existingImage)

        // Update imagesLists associations if provided
        input.imagesLists?.let { listIds ->
            val currentLists = imageListService.findImagesListsByImageId(id)
            val newListIds = listIds.toSet()

            // Remove from old lists
            currentLists.filter { it !in newListIds }.forEach { listId ->
                imageListService.removeImageFromImagesList(listId, updatedImage)
            }
            // Add to new lists
            newListIds.filter { it !in currentLists }.forEach { listId ->
                imageListService.addImageToImagesList(listId, updatedImage)
            }
        }
        return updatedImage
    }
}

class NoUrlAvailableException(message: String) : RuntimeException(message)
class InvalidFilenameException(message: String) : RuntimeException(message)
