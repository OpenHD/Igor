package org.openhdfpv.angularbackend.buildartefact

data class ImagePartialInput(
    val name: String? = null,
    val description: String? = null,
    val icon: String? = null,
    val urls: List<ImageUrlInput>? = null,
    val backupUrls: List<String>? = null,
    val extractSize: Long? = null,
    val extractSha256: String? = null,
    val imageDownloadSize: Long? = null,
    val isEnabled: Boolean? = null,
    val releaseDate: String? = null,
    val redirectsCount: Long? = null,
    val categoryId: Long? = null
)
