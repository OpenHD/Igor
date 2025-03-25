package org.openhdfpv.angularbackend.buildartefact

import org.slf4j.LoggerFactory
import java.net.HttpURLConnection
import java.net.URL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

@Service
class UrlAvailabilityService(
    private val imageService: ImageService // Using service to fetch and save entities
) {

    private val logger = LoggerFactory.getLogger(UrlAvailabilityService::class.java)

    @Scheduled(fixedRate = 900000) // 15 minutes
    fun checkUrlAvailability() {
        // Get all non-deleted image entities
        val entities = imageService.findAllNonDeleted()

        for (entity in entities) {
            var requiresUpdate = false

            // Iterate through each image URL in the entity
            entity.urls.forEach { imageUrl ->
                val available = isUrlReachable(imageUrl.url)
                // Check if the current availability status is different from the new status
                if (imageUrl.isAvailable != available) {
                    logger.info("Changing isAvailable for URL ${imageUrl.url} in Entity ${entity.name} to $available")
                    // Update the availability directly
                    imageUrl.isAvailable = available
                    requiresUpdate = true
                }
            }

            // Save the entity only if at least one URL's status was changed
            if (requiresUpdate) {
                imageService.save(entity)
            }
        }
    }

    /**
     * Checks if a URL is reachable.
     */
    private fun isUrlReachable(url: String): Boolean {
        return try {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.connectTimeout = 5000 // Connection timeout in milliseconds
            connection.requestMethod = "HEAD" // Use HEAD request to fetch only the headers
            connection.responseCode in 200..399 // HTTP status codes 2xx and 3xx are considered available
        } catch (e: Exception) {
            false // If an exception occurs, the URL is considered not available
        }
    }
}
