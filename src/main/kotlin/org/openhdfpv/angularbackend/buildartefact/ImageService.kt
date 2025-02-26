package org.openhdfpv.angularbackend.buildartefact

import org.openhdfpv.angularbackend.imager.ImagesList
import org.openhdfpv.angularbackend.imager.ImagesListRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class ImageService(
    private val buildImagesRepository: BuildImagesRepository,
    private val imagesListRepository: ImagesListRepository
)
{
    fun handleRedirect(imageEntity: ImageEntity?): ResponseEntity<Any> {
        return if (imageEntity != null) {
            // Erhöhe redirectsCount
            val updatedEntity = imageEntity.copy(redirectsCount = imageEntity.redirectsCount + 1)
            buildImagesRepository.save(updatedEntity) // Speichern der aktualisierten Entität

            ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", imageEntity.url)
                .build()
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("ImageEntity not found.")
        }
    }

    fun findBySha256(sha256: String): ImageEntity? {
        return buildImagesRepository.findByExtractSha256(sha256)
    }

    fun findById(id: UUID): Optional<ImageEntity> {
        return buildImagesRepository.findById(id)
    }

    fun findAll(): List<ImageEntity> {
        return buildImagesRepository.findAll()
    }

    fun save(image: ImageEntity) {
        buildImagesRepository.save(image)
    }

    fun delete(id: UUID) {
        // Prüfe, ob die ImageEntity vorhanden ist
        val imageEntityOptional = buildImagesRepository.findById(id)
        if (imageEntityOptional.isPresent) {
            val imageEntity = imageEntityOptional.get()

            // Setze das isDeleted-Flag auf true
            val updatedImageEntity = imageEntity.copy(isDeleted = true)

            // Speichere die aktualisierte Entität
            buildImagesRepository.save(updatedImageEntity)
        } else {
            throw IllegalArgumentException("ImageEntity mit ID $id wurde nicht gefunden.")
        }
    }

    // Bild zu ImagesList hinzufügen
    fun addImageToImagesList(imageId: UUID, imagesListId: Long): ImagesList? {
        val imageEntity = buildImagesRepository.findById(imageId).orElseThrow {
            IllegalArgumentException("ImageEntity mit ID $imageId wurde nicht gefunden.")
        }

        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId wurde nicht gefunden.")
        }

        val updatedImagesList = imagesList.copy(
            imageEntities = imagesList.imageEntities + imageEntity
        )

        return imagesListRepository.save(updatedImagesList)
    }

    // Bild aus ImagesList entfernen
    fun removeImageFromImagesList(imageId: UUID, imagesListId: Long): ImagesList? {
        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId wurde nicht gefunden.")
        }

        val updatedImagesList = imagesList.copy(
            imageEntities = imagesList.imageEntities.filter { it.id != imageId }.toSet()
        )

        return imagesListRepository.save(updatedImagesList)
    }

    // Kategorie für ein Bild aktualisieren (Many-to-One)
    fun updateImageCategory(imageId: UUID, categoryId: Long?): ImageEntity {
        val imageEntity = buildImagesRepository.findById(imageId).orElseThrow {
            IllegalArgumentException("ImageEntity mit ID $imageId wurde nicht gefunden.")
        }

        val category = categoryId?.let {
            // Laden der Kategorie
            null // Beispiel: Laden einer Kategorie aus einem Repository für OsCategory
        }

        val updatedImageEntity = imageEntity.copy(category = category)
        return buildImagesRepository.save(updatedImageEntity)
    }




}
