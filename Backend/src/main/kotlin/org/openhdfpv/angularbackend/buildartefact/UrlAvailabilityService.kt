package org.openhdfpv.angularbackend.buildartefact

import org.slf4j.LoggerFactory
import java.net.HttpURLConnection
import java.net.URL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

@Service
class UrlAvailabilityService(
    private val imageService: ImageService // Changed from repository to service
) {

    private val logger = LoggerFactory.getLogger(UrlAvailabilityService::class.java)

    @Scheduled(fixedRate = 900000) // 15 minutes
    fun checkUrlAvailability() {
        // Use service method to get non-deleted entities
        val entities = imageService.findAllNonDeleted()

        for (entity in entities) {
            val updatedUrls = entity.urls.map { imageUrl ->
                val available = isUrlReachable(imageUrl.url)
                if (imageUrl.isAvailable != available) {
                    logger.info("Änderung von isAvailable für URL ${imageUrl.url} in Entity ${entity.name}: $available")
                    imageUrl.copy(isAvailable = available)
                } else {
                    imageUrl
                }
            }

            var requiresUpdate = false

            if (updatedUrls != entity.urls) {
                entity.urls = updatedUrls
                requiresUpdate = true
            }

            if (requiresUpdate) {
                imageService.save(entity) // Use service to save changes
            }
        }
    }

    /**
     * Prüft, ob eine URL erreichbar ist
     */
    private fun isUrlReachable(url: String): Boolean {
        return try {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.connectTimeout = 5000 // Timeout für Verbindung
            connection.requestMethod = "HEAD" // HEAD-Anfrage, um nur Header abzurufen
            connection.responseCode in 200..399 // 2xx und 3xx Codes gelten als verfügbar
        } catch (e: Exception) {
            false // Bei einer Exception gilt die URL als nicht verfügbar
        }
    }
}
