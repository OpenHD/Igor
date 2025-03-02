package org.openhdfpv.angularbackend.buildartefact

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.*
import java.util.*

data class ImageUrlDTO(
    val url: String,
    val isDefault: Boolean = false,
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val isAvailable: Boolean = false
)

data class ImageDTO(
    // ID ist jetzt optional, weil sie beim Erstellen leer bleiben kann
    val id: UUID? = null,

    @field:NotBlank(message = "Name darf nicht leer sein")
    val name: String,

    @field:NotBlank(message = "Description darf nicht leer sein")
    val description: String,

    @field:NotBlank(message = "Icon URL darf nicht leer sein")
    val icon: String,

    @field:NotBlank(message = "Download URL darf nicht leer sein")
    val url: String,

    val urls: List<ImageUrlDTO> = emptyList(),

    val backupUrls: List<String> = emptyList(),

    @field:PositiveOrZero(message = "Extract Size muss >= 0 sein")
    val extractSize: Long,

    @field:NotBlank(message = "SHA256 Hash darf nicht leer sein")
    val extractSha256: String,

    @field:PositiveOrZero(message = "Download Size muss >= 0 sein")
    val imageDownloadSize: Long,

    val isEnabled: Boolean,

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val isAvailable: Boolean,

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    val redirectsCount: Long,

    val categoryId: Long?,

    @get:JsonProperty("_csrf")
    val csrfToken: String
)
