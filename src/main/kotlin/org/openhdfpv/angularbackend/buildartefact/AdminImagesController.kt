package org.openhdfpv.angularbackend.buildartefact

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import java.util.UUID
import org.springframework.ui.Model
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/admin/images")
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
    fun saveImage(@RequestBody @Valid dto: ImageUpdateDTO): ResponseEntity<Map<String, Any?>> {
        val savedImage = if (dto.id == null) {
            // Neuer Eintrag: Erstelle ein neues ImageEntity
            val newImage = ImageEntity(
                name = dto.name,
                description = dto.description,
                icon = dto.icon,
                url = dto.url,
                backupUrls = dto.backupUrls,
                extractSize = dto.extractSize,
                extractSha256 = dto.extractSha256,
                imageDownloadSize = dto.imageDownloadSize,
                releaseDate = "", // Hier ggf. einen sinnvollen Standardwert setzen
                initFormat = ""   // Ebenso hier
            )
            imageService.save(newImage)
        } else {
            // Bestehendes Image updaten
            val existingImage = imageService.findById(dto.id)
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
            imageService.save(existingImage)
        }

        val responseBody = mapOf(
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
        return ResponseEntity.ok(responseBody)
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
