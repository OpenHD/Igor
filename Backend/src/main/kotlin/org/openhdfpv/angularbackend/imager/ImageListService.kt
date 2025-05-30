package org.openhdfpv.angularbackend.imager

import jakarta.servlet.http.HttpServletRequest
import org.openhdfpv.angularbackend.special.ApplicationProperties
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import org.openhdfpv.angularbackend.special.EntityNotFoundException
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class ImageListService(
    private val imagesListRepository: ImagesListRepository,
    private val applicationProperties: ApplicationProperties // ApplicationProperties als Dependency
) {

    fun getAllImagesLists(): List<ImagesList> {
        return imagesListRepository.findAll().map { imagesList ->
            val filteredImages = imagesList.imageEntities.filter { !it.isDeleted }
            imagesList.imageEntities = filteredImages.toMutableSet() // Convert to mutable set
            imagesList
        }
    }


    fun getImagesListById(id: Long): ImagesList? =
        imagesListRepository.findById(id).orElse(null)

    fun getImagesListByEndpoint(endpoint: String): ImagesList? =
        imagesListRepository.findByEndpoint(endpoint)

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
                .toSortedMap(compareBy { it?.position }) // Sortieren nach Position
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
                                    "/download/image/filename/${imageEntity.getCurrentAvailableFilename()}"
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
        if (imagesListRepository.existsByName(imagesList.name)) {
            throw IllegalArgumentException("ImagesList existiert bereits.")
        }
        return imagesListRepository.save(imagesList)
    }

    // ImagesList aktualisieren
    fun updateImagesList(id: Long, updatedList: ImagesList): ImagesList {
        val existingList = imagesListRepository.findById(id)
            .orElseThrow { EntityNotFoundException("ImagesList nicht gefunden.") }
        existingList.latestVersion = updatedList.latestVersion
        existingList.url = updatedList.url
        existingList.name = updatedList.name
        existingList.endpoint = updatedList.endpoint
        existingList.description = updatedList.description
        existingList.imageEntities = updatedList.imageEntities
        return imagesListRepository.save(existingList)
    }



    // ImagesList löschen
    fun deleteImagesList(imagesListId: Long) {
        val imagesList = imagesListRepository.findById(imagesListId).orElseThrow {
            IllegalArgumentException("ImagesList mit ID $imagesListId wurde nicht gefunden.")
        }
        imagesListRepository.delete(imagesList)
    }

    fun mergeOrCreateImagesList(newData: ImagesList): ImagesList {
        val existingList = imagesListRepository.findByEndpointWithImages(newData.endpoint)
        return if (existingList != null) {
            // Update existing list's fields directly
            existingList.latestVersion = newData.latestVersion
            existingList.url = newData.url
            existingList.name = newData.name
            existingList.endpoint = newData.endpoint
            existingList.description = newData.description

            // Determine which new images to add (based on id comparison)
            val existingImageIds = existingList.imageEntities.map { it.id }.toSet()
            val newImagesToAdd = newData.imageEntities.filter { it.id !in existingImageIds }
            // Add the new images to the existing collection
            existingList.imageEntities.addAll(newImagesToAdd)

            imagesListRepository.save(existingList)
        } else {
            imagesListRepository.save(newData)
        }
    }

    private fun mergeImageEntities(existingImages: Set<ImageEntity>, newImages: Set<ImageEntity>): Set<ImageEntity> {
        val merged = existingImages.toMutableSet()
        newImages.forEach { newImage ->
            val existingImage = merged.firstOrNull { it.extractSha256 == newImage.extractSha256 }
            if (existingImage != null) {
                // Merge URLs and update the existing image directly
                val mergedUrls = (existingImage.urls + newImage.urls).distinctBy { it.url }.toMutableList()
                existingImage.urls = mergedUrls
                existingImage.name = newImage.name
                existingImage.description = newImage.description
                existingImage.releaseDate = newImage.releaseDate
                // No need to remove and add, as the entity is updated in place
            } else {
                merged.add(newImage)
            }
        }
        return merged
    }


    fun addImageToImagesList(imagesListId: Long, imageEntity: ImageEntity): ImagesList {
        val imagesList = imagesListRepository.findById(imagesListId)
            .orElseThrow { IllegalArgumentException("ImagesList not found") }
        if (!imagesList.imageEntities.any { it.id == imageEntity.id }) {
            imagesList.imageEntities += imageEntity
            return imagesListRepository.save(imagesList)
        }
        return imagesList
    }


    fun removeImageFromImagesList(imagesListId: Long, imageEntity: ImageEntity): ImagesList {
        val imagesList = imagesListRepository.findById(imagesListId)
            .orElseThrow { IllegalArgumentException("ImagesList with ID $imagesListId not found.") }
        imagesList.imageEntities = imagesList.imageEntities.filter { it.id != imageEntity.id }.toMutableSet()
        return imagesListRepository.save(imagesList)
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

    fun updateImagesListPartial(id: Long, input: ImagesListPartialInput): ImagesList {
        val existingList = imagesListRepository.findById(id).orElseThrow {
            EntityNotFoundException("ImagesList mit ID $id nicht gefunden.")
        }
        existingList.updateFromPartialInput(input)
        return imagesListRepository.save(existingList)
    }

    fun findImagesListsByImageId(imageId: UUID): List<Long> {
        return imagesListRepository.findByImageEntitiesId(imageId).map { it.id!! }
    }


}
