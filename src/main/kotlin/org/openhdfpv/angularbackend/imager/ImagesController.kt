package org.openhdfpv.angularbackend.imager

import org.springframework.http.ResponseEntity
import jakarta.servlet.http.HttpServletRequest
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/images")
class ImagesController(
    private val imageListService: ImageListService, // Service für Geschäftslogik
    private val httpServletRequest: HttpServletRequest
) {

    // Route für Export von JSON
    @GetMapping("/{endpoint}")
    fun exportImagesList(@PathVariable endpoint: String): ResponseEntity<Any> {
        val response = imageListService.createImageListResponse(endpoint, httpServletRequest)
        return if (response != null) {
            ResponseEntity.ok(response)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Route für Hinzufügen oder Mergen von JSON
    @PostMapping("/import")
    fun importOrMergeImagesList(@RequestBody imagesList: ImagesList): ResponseEntity<Any> {
        // Logik für Merge oder neuen Eintrag
        val savedList = imageListService.mergeOrCreateImagesList(imagesList)
        return ResponseEntity.ok(savedList)
    }
}
