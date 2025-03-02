package org.openhdfpv.angularbackend.exporter

import org.openhdfpv.angularbackend.buildartefact.BuildImagesRepository
import org.openhdfpv.angularbackend.buildartefact.ImageService
import org.openhdfpv.angularbackend.requeststats.LogRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/download/image")
class DownloadRedirect(
    private val buildImagesRepository: BuildImagesRepository,
    private val imageService: ImageService
) {

    @LogRequest(type = "DOWNLOAD", origin = "ImageDownload", relatedEntity = true, description = "Redirect by SHA256")
    @GetMapping("/sha256/{sha256}")
    fun redirectToImageUrl(@PathVariable sha256: String): ResponseEntity<Any> {
        val imageEntity = imageService.findBySha256(sha256)
        return imageService.handleRedirect(imageEntity)
    }

    @LogRequest(type = "DOWNLOAD", origin = "ImageDownload", relatedEntity = true, description = "Redirect by ID")
    @GetMapping("/id/{id}")
    fun redirectToImageUrlById(@PathVariable id: UUID): ResponseEntity<Any> {
        val imageEntity = imageService.findById(id)
        return imageService.handleRedirect(imageEntity)
    }



    @GetMapping("/summary")
    fun getRedirectsSummary(): ResponseEntity<List<Map<String, Any>>> {
        val images = buildImagesRepository.findAll()
        val summary = images.map {
            mapOf(
                "name" to it.name,
                "description" to it.description,
                "redirectsCount" to it.redirectsCount
            )
        }
        return ResponseEntity.ok(summary)
    }


}
