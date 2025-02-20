package org.openhdfpv.angularbackend.exporter

import org.openhdfpv.angularbackend.buildartefact.BuildImagesRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/download")
class DownloadRedirect(
    private val buildImagesRepository: BuildImagesRepository
) {

    @GetMapping("/{sha265}")
    fun redirectToImageUrl(@PathVariable sha265: String): ResponseEntity<Any> {
        val imageEntity = buildImagesRepository.findByExtractSha256(sha265)
        return if (imageEntity != null) {
            // Erhöhe redirectsCount
            val updatedEntity = imageEntity.copy(redirectsCount = imageEntity.redirectsCount + 1)
            buildImagesRepository.save(updatedEntity) // Speichern der aktualisierten Entität

            ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", imageEntity.url)
                .build()
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("ImageEntity with hash $sha265 not found.")
        }
    }

    @GetMapping("/summary")
    fun getRedirectsSummary(): ResponseEntity<List<Map<String, Any>>> {
        val images = buildImagesRepository.findAll()
        val summary = images.map {
            mapOf(
                "name" to it.name,
                "redirectsCount" to it.redirectsCount
            )
        }
        return ResponseEntity.ok(summary)
    }


}