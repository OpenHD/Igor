package org.openhdfpv.angularbackend.imager

data class ImagesListPartialInput(
    val latestVersion: String? = null,
    val url: String? = null,
    val name: String? = null,
    val endpoint: String? = null,
    val description: String? = null
)
