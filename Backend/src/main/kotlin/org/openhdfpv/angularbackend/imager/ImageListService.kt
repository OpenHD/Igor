package org.openhdfpv.angularbackend.imager

import jakarta.servlet.http.HttpServletRequest
import org.openhdfpv.angularbackend.ApplicationProperties
import org.openhdfpv.angularbackend.buildartefact.BuildImagesRepository
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ImageListService(
    private val imagesListRepository: ImagesListRepository,
    private val applicationProperties: ApplicationProperties // ApplicationProperties als Dependency
) {

    fun createImageListResponse(endpoint: String, request: HttpServletRequest): Map<String, Any>? {
        val imagesList = imagesListRepository.findAll().find { it.endpoint == endpoint }
            ?: return null

        // Prüfen, ob Redirect aktiviert ist
        val redirectEnabled = applicationProperties.redirect.enabled

        return mapOf(
            "imager" to mapOf(
                "latest_version" to imagesList.latestVersion,
                "url" to imagesList.url // Vollständige URL
            ),
            "os_list" to imagesList.imageEntities.groupBy { it.category }
                .mapNotNull { (category, imageEntities) ->
                    val availableSubitems = imageEntities
                        .filter { it.isEnabled && !it.isDeleted && it.getAvailable() }
                        .sortedByDescending { it.releaseDate }
                        .map { imageEntity ->
                            mapOf(
                                "name" to imageEntity.name,
                                "description" to imageEntity.description,
                                "icon" to imageEntity.icon,
                                "url" to if (redirectEnabled) generateFullUrl(
                                    request,
                                    "/download/image/id/${imageEntity.id}"
                                ) else imageEntity.getCurrentAvailableUrl(),
                                "extract_size" to imageEntity.extractSize,
                                "extract_sha256" to imageEntity.extractSha256,
                                "image_download_size" to imageEntity.imageDownloadSize,
                                "release_date" to imageEntity.releaseDate,
                                "init_format" to imageEntity.initFormat
                            )
                        }

                    if (availableSubitems.isEmpty()) null else mapOf(
                        "name" to (category?.name ?: "Unknown Category"),
                        "description" to (category?.description ?: "No description available"),
                        "icon" to (category?.icon ?: "default-icon.png"),
                        "subitems" to availableSubitems
                    )
                }
        )
    }

    // Hilfsmethode zur Generierung einer vollständigen URL
    private fun generateFullUrl(request: HttpServletRequest, path: String): String {
        val scheme = request.scheme // z.B. http oder https
        val host = request.serverName // z.B. example.com
        val port = request.serverPort // z.B. 8080

        return if (port == 80 || port == 443) {
            "$scheme://$host$path"
        } else {
            "$scheme://$host:$port$path"
        }
    }

    // ImagesList erstellen
    fun createImagesList(imagesList: ImagesList): ImagesList {
        if (imagesListRepository.findByName(imagesList.name).isPresent) {
            throw IllegalArgumentException("ImagesList mit dem Namen ${imagesList.name} existiert bereits.")
        }
        return imagesListRepository.save(imagesList)
    }

    // ImagesList aktualisieren
    fun updateImagesList(imagesListId: Long, updatedData: ImagesList): ImagesList {
        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId wurde nicht gefunden.")
        }

        val updatedImagesList = imagesList.copy(
            name = updatedData.name,
            description = updatedData.description,
            url = updatedData.url,
            latestVersion = updatedData.latestVersion,
            endpoint = updatedData.endpoint
        )
        return imagesListRepository.save(updatedImagesList)
    }

    // ImagesList löschen
    fun deleteImagesList(imagesListId: Long) {
        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId wurde nicht gefunden.")
        }
        imagesListRepository.delete(imagesList)
    }

    fun mergeOrCreateImagesList(newData: ImagesList): ImagesList {
        // Prüfen, ob eine ImagesList mit dem gleichen 'endpoint' bereits existiert
        val existingList = imagesListRepository.findByEndpoint(newData.endpoint)

        return if (existingList != null) {
            // Merge Logik: Bestehende Daten aktualisieren
            val mergedList = existingList.copy(
                name = newData.name,
                description = newData.description,
                imageEntities = mergeImageEntities(existingList.imageEntities, newData.imageEntities)
            )
            imagesListRepository.save(mergedList)
        } else {
            // Neuen Eintrag erstellen
            imagesListRepository.save(newData)
        }

    }

    private fun mergeImageEntities(existingImages: Set<ImageEntity>, newImages: Set<ImageEntity>): Set<ImageEntity> {
        val merged = existingImages.toMutableSet()

        // Alle neuen Einträge hinzufügen oder bestehende aktualisieren
        newImages.forEach { newImage ->
            val existingImage = merged.firstOrNull { it.id == newImage.id }
            if (existingImage != null) {
                // Update vorhandener Einträge
                merged.remove(existingImage)
                merged.add(existingImage.copy(
                    name = newImage.name,
                    description = newImage.description,
                    url = newImage.url,
                    releaseDate = newImage.releaseDate
                ))
            } else {
                // Neues Bild hinzufügen
                merged.add(newImage)
            }
        }

        return merged
    }

    // ImageListService.kt
    fun addImageToImagesList(imagesListId: Long, imageEntity: ImageEntity): ImagesList {
        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId nicht gefunden.")
        }
        val updatedList = imagesList.copy(imageEntities = imagesList.imageEntities + imageEntity)
        return imagesListRepository.save(updatedList)
    }

    fun removeImageFromImagesList(imagesListId: Long, imageEntity: ImageEntity): ImagesList {
        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId nicht gefunden.")
        }
        val updatedList = imagesList.copy(
            imageEntities = imagesList.imageEntities.filter { it.id != imageEntity.id }.toSet()
        )
        return imagesListRepository.save(updatedList)
    }

    fun deleteAll() {
        imagesListRepository.deleteAll()
    }

    @Transactional(readOnly = true)
    fun getAllEndpoints(): List<String> {
        return imagesListRepository.findAll().map { it.endpoint }
    }

    // Optional mit Caching
    @Transactional(readOnly = true)
    @Cacheable("imageListEndpoints")
    fun getAllEndpointsCached(): List<String> {
        return getAllEndpoints()
    }

}
