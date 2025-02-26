package org.openhdfpv.angularbackend.imager

import jakarta.servlet.http.HttpServletRequest
import org.openhdfpv.angularbackend.ApplicationProperties
import org.springframework.stereotype.Service

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
                "url" to if (redirectEnabled) generateFullUrl(request, "/api/download/${imagesList.id}") else imagesList.url // Vollständige URL
            ),
            "os_list" to imagesList.imageEntities.groupBy { it.category }
                .map { (category, imageEntities) ->
                    mapOf(
                        "name" to (category?.name ?: "Unknown Category"),
                        "description" to (category?.description ?: "No description available"),
                        "icon" to (category?.icon ?: "default-icon.png"),
                        "subitems" to imageEntities
                            .filter { it.isEnabled && !it.isDeleted && it.isAvailable }
                            .sortedByDescending { it.releaseDate }
                            .map { imageEntity ->
                                mapOf(
                                    "name" to imageEntity.name,
                                    "description" to imageEntity.description,
                                    "icon" to imageEntity.icon,
                                    "url" to if (redirectEnabled) generateFullUrl(request, "/download/image/id/${imageEntity.id}") else imageEntity.url,
                                    "extract_size" to imageEntity.extractSize,
                                    "extract_sha256" to imageEntity.extractSha256,
                                    "image_download_size" to imageEntity.imageDownloadSize,
                                    "release_date" to imageEntity.releaseDate,
                                    "init_format" to imageEntity.initFormat
                                )
                            }
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
}
