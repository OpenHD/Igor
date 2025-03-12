package org.openhdfpv.angularbackend.imager

data class ImagesListInput(
    val latestVersion: String,
    val url: String,
    val name: String,
    val endpoint: String,
    val description: String,
    val imageIds: List<String>? = null
)
