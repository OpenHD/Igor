package org.openhdfpv.angularbackend.buildartefact

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class ImageService(private val buildImagesRepository: BuildImagesRepository)
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



}
