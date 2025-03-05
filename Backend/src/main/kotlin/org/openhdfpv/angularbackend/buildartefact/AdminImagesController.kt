package org.openhdfpv.angularbackend.buildartefact

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import java.util.UUID
import org.springframework.ui.Model
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/adminold/images")
@Validated
class AdminImagesController(
    private val imageService: ImageService // Service statt Repository
) {

    @GetMapping
    fun listImages(model: Model): String {
        // Nur nicht gelöschte Images anzeigen
        val images = imageService.findAll().filter { !it.isDeleted }
        model.addAttribute("images", images)
        model.addAttribute("title", "OS Images Verwaltung")
        return "images/list"
    }

    @GetMapping("/{id}")
    @ResponseBody
    fun getImage(@PathVariable id: UUID): ResponseEntity<ImageEntity> {
        val image = imageService.findById(id)
        return ResponseEntity.ok(image)
    }

    @GetMapping("/edit/{id}")
    fun editImage(@PathVariable id: UUID, model: Model): String {
        val image = imageService.findById(id)
        model.addAttribute("image", image)
        model.addAttribute("title", "Image bearbeiten")
        return "images/edit"
    }

    @GetMapping("/create")
    fun createImage(model: Model): String {
        model.addAttribute("image", ImageEntity(
            name = "",
            description = "",
            icon = "",
            url = "",
            backupUrls = emptyList(),
            extractSize = 0,
            extractSha256 = "",
            imageDownloadSize = 0,
            releaseDate = "",
            initFormat = ""
        ))
        model.addAttribute("title", "Neues Image erstellen")
        return "images/edit"
    }

    @PostMapping("/save")
    @ResponseBody
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
            "category" to savedImage.category?.let {
                mapOf("id" to it.id, "name" to it.name)
            }
        ))
    }


    @PatchMapping("/{id}/status")
    @ResponseBody
    fun updateImageStatus(
        @PathVariable id: UUID,
        @RequestBody body: Map<String, Boolean>
    ): ResponseEntity<ImageEntity> {
        val image = imageService.findById(id)
        image.isEnabled = body["enabled"] ?: image.isEnabled
        val savedImage = imageService.save(image)
        return ResponseEntity.ok(savedImage)
    }
}
