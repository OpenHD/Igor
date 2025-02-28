package org.openhdfpv.angularbackend.buildartefact

import org.openhdfpv.angularbackend.imager.ImageListService
import org.openhdfpv.angularbackend.imager.ImagesList
import org.openhdfpv.angularbackend.imager.ImagesListRepository
import org.openhdfpv.angularbackend.special.EntityNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class ImageService(
    private val buildImagesRepository: BuildImagesRepository,
    private val imageListService: ImageListService // Statt ImagesListRepository
) {

    fun handleRedirect(imageEntity: ImageEntity?): ResponseEntity<Any> =
        imageEntity?.let { entity ->
            val updatedEntity = entity.copy(redirectsCount = entity.redirectsCount + 1)
            buildImagesRepository.save(updatedEntity)
            ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", entity.url)
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
        val updatedImageEntity = imageEntity.copy(isDeleted = true)
        buildImagesRepository.save(updatedImageEntity)
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
        val category = categoryId?.let {
            // Beispiel: osCategoryRepository.findById(it).orElse(null)
            null
        }
        val updatedImageEntity = imageEntity.copy(category = category)
        return save(updatedImageEntity)
    }

    fun findAllNonDeleted(): List<ImageEntity> = buildImagesRepository.findByIsDeletedFalse()

    fun deleteAll() = buildImagesRepository.deleteAll()

    // ImageService.kt
    fun saveFromDto(dto: ImageUpdateDTO): ImageEntity {
        return if (dto.id != null) {
            val existingImage = findById(dto.id)
            existingImage.apply {
                name = dto.name
                description = dto.description
                icon = dto.icon
                url = dto.url
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
                }
            }
            save(existingImage)
        } else {
            val newImage = ImageEntity(
                name = dto.name,
                description = dto.description,
                icon = dto.icon,
                url = dto.url,
                backupUrls = dto.backupUrls,
                extractSize = dto.extractSize,
                extractSha256 = dto.extractSha256,
                imageDownloadSize = dto.imageDownloadSize,
                urls = dto.urls.map { urlDto ->
                    ImageUrl(
                        url = urlDto.url,
                        isDefault = urlDto.isDefault
                    )
                },
                releaseDate = "", // Setzen Sie hier Standardwerte
                initFormat = ""
            )
            save(newImage)
        }
    }

}
