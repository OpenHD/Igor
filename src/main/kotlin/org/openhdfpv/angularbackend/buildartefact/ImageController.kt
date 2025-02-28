package org.openhdfpv.angularbackend.buildartefact

import org.openhdfpv.angularbackend.oscategory.OsCategoryService
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import java.util.UUID

@Controller
@RequestMapping("/images")
class ImageController(
    private val imageService: ImageService,
    private val osCategoryService: OsCategoryService
) {

    @GetMapping
    fun listImages(model: Model): String {
        val images = imageService.findAll()
        val categories = osCategoryService.findAllCategories() // Service-Methode

        model.addAttribute("images", images)
        model.addAttribute("categories", categories)
        return "image/list"
    }

    @GetMapping("/edit")
    fun editImage(@RequestParam("id", required = false) id: UUID?, model: Model): String {
        val image = id?.let { imageService.findById(it) } ?: ImageEntity(
            name = "",
            description = "",
            icon = "",
            url = "",
            extractSize = 0,
            extractSha256 = "",
            imageDownloadSize = 0,
            releaseDate = "",
            initFormat = "",
            category = null
        )
        val categories = osCategoryService.findAllCategories() // Service-Methode

        model.addAttribute("image", image)
        model.addAttribute("categories", categories)
        return "image/edit"
    }

    @PostMapping
    fun saveImage(@ModelAttribute image: ImageEntity): String {
        imageService.save(image) // Speichern des Images
        return "redirect:/images"
    }

    @PostMapping("/delete")
    fun deleteImage(@RequestParam("id") id: UUID): String {
        imageService.delete(id) // Löschen anhand der ID
        return "redirect:/images"
    }
}
