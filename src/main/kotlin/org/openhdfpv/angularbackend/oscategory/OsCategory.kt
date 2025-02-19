package org.openhdfpv.angularbackend.oscategory

import jakarta.persistence.*;


@Entity
data class OsCategory(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val name: String = "", // Default added

    @Column(nullable = false)
    val description: String = "", // Default added

    @Column(nullable = false)
    val icon: String = "" // Default added
)