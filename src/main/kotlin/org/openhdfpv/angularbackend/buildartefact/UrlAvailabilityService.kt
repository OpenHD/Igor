package org.openhdfpv.angularbackend.buildartefact

import org.slf4j.LoggerFactory
import java.net.HttpURLConnection
import java.net.URL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

@Service
class UrlAvailabilityService(
    private val imageRepository: BuildImagesRepository
) {

    private val logger = LoggerFactory.getLogger(UrlAvailabilityService::class.java)

    @Scheduled(fixedRate = 10000) // Alle 30 Sekunden
    fun checkUrlAvailability() {

        // Alle nicht gelöschten Entities abrufen
        val entities = imageRepository.findByIsDeletedFalse()

        for (entity in entities) {
            val isAvailable = isUrlReachable(entity.url)
            if (entity.isAvailable != isAvailable) { // Nur updaten, wenn nötig
                logger.info("Änderung von isAvailable für Entity ${entity.name}: $isAvailable")
                entity.copy(isAvailable = isAvailable).let {
                    imageRepository.save(it) // Speichern des aktualisierten Status
                }
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
