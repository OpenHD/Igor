package org.openhdfpv.angularbackend.oscategory


data class OsCategoryInputUpdate(
    val id: Long,          // Erforderlich für Identifikation
    val name: String?,      // Optional
    val description: String?,
    val icon: String?
)
