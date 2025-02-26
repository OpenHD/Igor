package org.openhdfpv.angularbackend.buildartefact

import com.fasterxml.jackson.annotation.JsonProperty
import java.util.*

data class ImageUpdateDTO(
    val id: UUID,
    val name: String,
    val description: String,
    val icon: String,
    val url: String,
    val backupUrls: List<String>,
    val extractSize: Long,
    val extractSha256: String,
    val imageDownloadSize: Long,
    val isEnabled: Boolean,
    @get:JsonProperty("_csrf") val csrfToken: String
)
