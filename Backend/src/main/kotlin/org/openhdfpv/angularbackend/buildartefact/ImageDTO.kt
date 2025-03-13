package org.openhdfpv.angularbackend.buildartefact

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import java.util.UUID

data class ImageUrlDTO(
    val url: String,
    val isDefault: Boolean = false,
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val isAvailable: Boolean = false
)

data class ImageDTO(
    val id: UUID? = null,

    @field:NotBlank(message = "Name darf nicht leer sein")
    val name: String,

    @field:NotBlank(message = "Description darf nicht leer sein")
    val description: String,

    @field:NotBlank(message = "Icon URL darf nicht leer sein")
    val icon: String,

    val urls: List<ImageUrlDTO> = emptyList(),

    val backupUrls: List<String> = emptyList(),

    @field:PositiveOrZero(message = "Extract Size muss >= 0 sein")
    val extractSize: Long,

    @field:NotBlank(message = "SHA256 Hash darf nicht leer sein")
    val extractSha256: String,

    @field:PositiveOrZero(message = "Download Size muss >= 0 sein")
    val imageDownloadSize: Long,

    val isEnabled: Boolean = true,

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val redirectsCount: Long = 0,

    val categoryId: Long?,

    val imagesLists: List<Long>? = null
)

// Input-Klassen für GraphQL (nur die Felder, die auch geändert/gesetzt werden sollen)
data class ImageInput(
    val name: String,
    val description: String,
    val icon: String,
    val urls: List<ImageUrlInput>,
    val extractSize: Long,
    val extractSha256: String?,
    val imageDownloadSize: Long,
    val categoryId: Long?,
    val isEnabled: Boolean = true,
    val imagesLists: List<Long>? = null
) {
    fun toDTO(): ImageDTO = ImageDTO(
        name = name,
        description = description,
        icon = icon,
        urls = urls.map { ImageUrlDTO(it.url, it.isDefault) },
        extractSize = extractSize,
        extractSha256 = extractSha256 ?: "",
        imageDownloadSize = imageDownloadSize,
        categoryId = categoryId,
        isEnabled = isEnabled,
        imagesLists = imagesLists ?: emptyList()
    )
}

data class ImageUrlInput(
    val url: String,
    val isDefault: Boolean
)
