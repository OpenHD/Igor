package org.openhdfpv.angularbackend.buildartefact

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class ImageUrl(
    @Column(nullable = false)
    var url: String,

    // Gibt an, ob diese URL aktuell erreichbar ist
    var isAvailable: Boolean = false,

    // Kennzeichnet, ob es sich um die Standard-URL handelt
    var isDefault: Boolean = false
)
