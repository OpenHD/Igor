package org.openhdfpv.angularbackend.exporter

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.servlet.http.HttpServletRequest
import org.openhdfpv.angularbackend.imager.ImageListService

@RestController
@RequestMapping("/image_list", "image_lists")
class DownloadListExporter(
    private val imageListService: ImageListService // Repository entfernt
) {

    @GetMapping("", "/")
    fun getAvailableImageListEndpoints(): ResponseEntity<List<String>> {
        val endpoints = imageListService.getAllEndpoints() // Service-Methode
        return ResponseEntity.ok(endpoints)
    }

    @GetMapping("/{endpoint}")
    fun getImageListByEndpoint(
        @PathVariable endpoint: String,
        request: HttpServletRequest
    ): ResponseEntity<Map<String, Any>> {
        val response = imageListService.createImageListResponse(endpoint, request)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(response)
    }

}
