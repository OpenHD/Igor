package org.openhdfpv.angularbackend.buildartefact

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import java.util.UUID
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/admin/images")
class AdminImagesController(
    private val buildImagesRepository: BuildImagesRepository
) {
    @GetMapping
    fun listImages(model: Model): String {
        // Nur nicht gelöschte Images anzeigen
        val images = buildImagesRepository.findByIsDeletedFalse()
        model.addAttribute("images", images)
        model.addAttribute("title", "OS Images Verwaltung")
        return "images/list"
    }

    @GetMapping("/edit/{id}")
    fun editImage(@PathVariable id: UUID, model: Model): String {
        val image: ImageEntity = buildImagesRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Kein Image mit der ID: $id gefunden!") }
        model.addAttribute("image", image)
        model.addAttribute("title", "Image bearbeiten")
        return "images/edit"
    }

    @GetMapping("/create")
    fun createImage(model: Model): String {
        model.addAttribute("image", ImageEntity(
            name = "", description = "", icon = "", url = "",
            backupUrls = emptyList(), extractSize = 0, extractSha256 = "",
            imageDownloadSize = 0, releaseDate = "", initFormat = ""
        ))
        model.addAttribute("title", "Neues Image erstellen")
        return "images/edit"
    }


    @PostMapping("/save")
    @ResponseBody
    fun saveImage(@RequestBody dto: ImageUpdateDTO): ResponseEntity<Map<String, Any?>> {
        val existingImage = buildImagesRepository.findById(dto.id)
            .orElseThrow { IllegalArgumentException("Image not found") }

        existingImage.apply {
            name = dto.name
            description = dto.description
            icon = dto.icon
            url = dto.url
            backupUrls = dto.backupUrls
            extractSize = dto.extractSize
            extractSha256 = dto.extractSha256
            imageDownloadSize = dto.imageDownloadSize
            isEnabled = dto.isEnabled
        }

        val savedImage = buildImagesRepository.save(existingImage)

        return ResponseEntity.ok(
            mapOf(
                "id" to savedImage.id,
                "name" to savedImage.name,
                "description" to savedImage.description,
                "icon" to savedImage.icon,
                "url" to savedImage.url,
                "backupUrls" to savedImage.backupUrls,
                "extractSize" to savedImage.extractSize,
                "extractSha256" to savedImage.extractSha256,
                "imageDownloadSize" to savedImage.imageDownloadSize,
                "isEnabled" to savedImage.isEnabled
            )
        )
    }

    @PatchMapping("/{id}/status")
    @ResponseBody
    fun updateImageStatus(
        @PathVariable id: UUID,
        @RequestBody body: Map<String, Boolean>
    ): ResponseEntity<ImageEntity> {
        val image = buildImagesRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Image not found") }

        image.isEnabled = body["enabled"] ?: image.isEnabled
        val savedImage = buildImagesRepository.save(image)

        return ResponseEntity.ok(savedImage)
    }
}
