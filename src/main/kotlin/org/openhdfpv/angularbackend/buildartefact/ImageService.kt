package org.openhdfpv.angularbackend.buildartefact

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
    private val imagesListRepository: ImagesListRepository
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

    fun addImageToImagesList(imageId: UUID, imagesListId: Long) =
        imagesListRepository.findById(imagesListId).map { imagesList ->
            val imageEntity = findById(imageId)
            val updatedImagesList = imagesList.copy(
                imageEntities = imagesList.imageEntities + imageEntity
            )
            imagesListRepository.save(updatedImagesList)
        }.orElseThrow { EntityNotFoundException("ImagesList with ID $imagesListId not found") }

    fun removeImageFromImagesList(imageId: UUID, imagesListId: Long) =
        imagesListRepository.findById(imagesListId).map { imagesList ->
            val updatedImagesList = imagesList.copy(
                imageEntities = imagesList.imageEntities.filter { it.id != imageId }.toSet()
            )
            imagesListRepository.save(updatedImagesList)
        }.orElseThrow { EntityNotFoundException("ImagesList with ID $imagesListId not found") }

    fun updateImageCategory(imageId: UUID, categoryId: Long?): ImageEntity {
        val imageEntity = findById(imageId)
        val category = categoryId?.let {
            // Beispiel: osCategoryRepository.findById(it).orElse(null)
            null
        }
        val updatedImageEntity = imageEntity.copy(category = category)
        return save(updatedImageEntity)
    }
}
