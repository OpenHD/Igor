package org.openhdfpv.angularbackend.special

import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import org.openhdfpv.angularbackend.imager.ImagesList
import org.openhdfpv.angularbackend.oscategory.OsCategory
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import org.openhdfpv.angularbackend.buildartefact.ImageService
import org.openhdfpv.angularbackend.buildartefact.ImageUrl
import org.openhdfpv.angularbackend.imager.ImageListService
import org.openhdfpv.angularbackend.oscategory.OsCategoryService
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.http.MediaType
import org.springframework.http.codec.json.Jackson2JsonDecoder
import org.springframework.web.reactive.function.client.ExchangeStrategies
import org.springframework.web.reactive.function.client.bodyToMono


@Configuration
@Profile("dev")
class DummyDataLoader(
    private val imageListService: ImageListService,
    private val osCategoryService: OsCategoryService,
    private val imageService: ImageService
) {

    private val jsonUrl = "https://raw.githubusercontent.com/OpenHD/OpenHD-ImageWriter/refs/heads/master/src/OpenHD-development-releases.json"

    @Bean
    fun dummyDataInitializer(objectMapper: ObjectMapper): CommandLineRunner {
        return CommandLineRunner { _ ->
            imageListService.deleteAll()
            imageService.deleteAll()
            osCategoryService.deleteAll()

            val webClient = WebClient.builder()
                .exchangeStrategies(customExchangeStrategies(objectMapper))
                .build()

            processJsonSource(webClient)
        }
    }

    private fun processJsonSource(webClient: WebClient) {
        val jsonData = webClient.get()
            .uri(jsonUrl)
            .accept(MediaType.APPLICATION_JSON)
            .retrieve()
            .bodyToMono<OpenHdData>()
            .block() ?: throw RuntimeException("Daten konnten nicht geladen werden")

        val listName = deriveListNameFromUrl()
        val endpoint = generateEndpoint(listName)
        val savedImages = mutableListOf<ImageEntity>()

        jsonData.osList.forEach { categoryJson ->
            val osCategory = osCategoryService.findCategoryByName(categoryJson.name)
                ?: osCategoryService.createOsCategory(
                    OsCategory(
                        name = categoryJson.name,
                        description = categoryJson.description,
                        icon = categoryJson.icon
                    )
                )

            categoryJson.subitems.forEach { imageJson ->
                val sha256 = imageJson.extractSha256.lowercase().trim()
                val existingImage = imageService.findBySha256(sha256)

                if (existingImage != null) {
                    handleExistingImage(existingImage, imageJson.url)
                    savedImages.add(existingImage)
                } else {
                    val newImage = createNewImageEntity(imageJson, osCategory)
                    imageService.save(newImage)
                    savedImages.add(newImage)
                }
            }
        }

        imageListService.mergeOrCreateImagesList(
            ImagesList(
                latestVersion = jsonData.imager.latestVersion,
                url = jsonData.imager.url,
                name = listName,
                endpoint = endpoint,
                description = "Automatisch generierte Liste",
                imageEntities = savedImages.toSet()
            )
        )
    }

    private fun handleExistingImage(existingImage: ImageEntity, newUrl: String) {
        // Check if URL already exists
        val urlExists = existingImage.urls.any { it.url == newUrl }

        if (!urlExists) {
            val newImageUrl = ImageUrl(
                url = newUrl,
                isAvailable = false,
                isDefault = false
            )
            val updatedImage = existingImage.copy(
                urls = existingImage.urls + newImageUrl
            )
            imageService.save(updatedImage)
        }
    }

    private fun createNewImageEntity(
        imageJson: ImageJson,
        category: OsCategory
    ) = ImageEntity(
        name = imageJson.name.trim(),
        description = imageJson.description,
        icon = imageJson.icon,
        urls = listOf(
            ImageUrl(
                url = imageJson.url,
                isAvailable = false,
                isDefault = true
            )
        ),
        extractSize = imageJson.extractSize,
        extractSha256 = imageJson.extractSha256,
        imageDownloadSize = imageJson.imageDownloadSize,
        releaseDate = imageJson.releaseDate,
        initFormat = imageJson.initFormat ?: "systemd",
        category = category,
        url = imageJson.url,
    )

    private fun customExchangeStrategies(objectMapper: ObjectMapper) =
        ExchangeStrategies.builder()
            .codecs { configurer ->
                configurer.defaultCodecs().jackson2JsonDecoder(
                    Jackson2JsonDecoder(objectMapper, MediaType.TEXT_PLAIN)
                )
            }
            .build()

    private fun deriveListNameFromUrl(): String {
        return jsonUrl.substringAfterLast('/')
            .substringBeforeLast('.')
            .replace(Regex("[_-]+"), " ")
                .replace(Regex("[^\\w\\s]"), "")
                .trim()
    }

    private fun generateEndpoint(listName: String): String {
        return listName
            .lowercase()
            .replace(Regex("[^a-z0-9]"), "-")
            .replace(Regex("-+"), "-")
            .trim('-')
    }
}


data class OpenHdData(
    @JsonProperty("imager") val imager: Imager,
    @JsonProperty("os_list") val osList: List<OsCategoryJson>
)

data class Imager(
    @JsonProperty("latest_version") val latestVersion: String,
    @JsonProperty("url") val url: String
)

data class OsCategoryJson(
    @JsonProperty("name") val name: String,
    @JsonProperty("description") val description: String,
    @JsonProperty("icon") val icon: String,
    @JsonProperty("subitems") val subitems: List<ImageJson>
)

data class ImageJson(
    @JsonProperty("name") val name: String,
    @JsonProperty("description") val description: String,
    @JsonProperty("icon") val icon: String,
    @JsonProperty("url") val url: String,
    @JsonProperty("extract_size") val extractSize: Long,
    @JsonProperty("extract_sha256") val extractSha256: String,
    @JsonProperty("image_download_size") val imageDownloadSize: Long,
    @JsonProperty("release_date") val releaseDate: String,
    @JsonProperty("init_format") val initFormat: String?
)
