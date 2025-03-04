package org.openhdfpv.angularbackend.buildartefact

import jakarta.validation.Valid
import org.openhdfpv.angularbackend.oscategory.OsCategory
import org.openhdfpv.angularbackend.oscategory.OsCategoryService
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.*
import java.util.UUID
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["http://localhost:4200", "http://127.0.0.1:4200"], allowedHeaders = ["*"], methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE])@RestController // Statt @Controller
@RequestMapping("/admin/images")
@Validated
class AngularImagesController(
    private val imageService: ImageService,
    private val osCategoryService: OsCategoryService
) { // Alle Images als JSON zurückgeben
    @GetMapping
    fun listImages(): ResponseEntity<List<ImageEntity>> {
        val images = imageService.findAllNonDeleted()
        return ResponseEntity.ok(images)
    }

    // Einzelnes Image als JSON
    @GetMapping("/{id}")
    fun getImage(@PathVariable id: UUID): ResponseEntity<ImageEntity> {
        val image = imageService.findById(id)
        return ResponseEntity.ok(image)
    }

    // Image erstellen/aktualisieren
    @PostMapping("/save")
    fun saveImage(@RequestBody @Valid dto: ImageDTO): ResponseEntity<Map<String, Any?>> {
        val savedImage = imageService.saveFromDto(dto)
        return ResponseEntity.ok(mapOf(
            "id" to savedImage.id,
            "name" to savedImage.name,
            "description" to savedImage.description,
            "icon" to savedImage.icon,
            "urls" to savedImage.urls.map { mapOf("url" to it.url, "isDefault" to it.isDefault) },
            "backupUrls" to savedImage.backupUrls,
            "isEnabled" to savedImage.isEnabled,
            "category" to savedImage.category?.let { mapOf("id" to it.id, "name" to it.name) },
            "categoryId" to savedImage.category?.id
        ))
    }

    // Status aktualisieren
    @PatchMapping("/{id}/status")
    fun updateImageStatus(
        @PathVariable id: UUID,
        @RequestBody body: Map<String, Boolean>
    ): ResponseEntity<ImageEntity> {
        val image = imageService.findById(id)
        image.isEnabled = body["enabled"] ?: image.isEnabled
        val savedImage = imageService.save(image)
        return ResponseEntity.ok(savedImage)
    }

    // Neuer Endpunkt zum Löschen
    @DeleteMapping("/{id}")
    fun deleteImage(@PathVariable id: UUID): ResponseEntity<Void> {
        imageService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @RequestMapping("/categories")
    fun getCategories(): ResponseEntity<List<OsCategory>> {
        val categories = osCategoryService.findAllCategories()
        return ResponseEntity.ok(categories)
    }
}
