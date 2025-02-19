package org.openhdfpv.angularbackend.imager

import jakarta.persistence.*
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import org.openhdfpv.angularbackend.oscategory.OsCategory


@Entity
data class ImagesList(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val latestVersion: String = "", // Default value added

    @Column(nullable = false)
    val url: String = "", // Default value added

    @Column(nullable = false, unique = true)
    val name: String = "", // Default value added

    @Column(nullable = false, unique = true)
    val endpoint: String = "", // Default value added

    @Column(nullable = false)
    val description: String = "", // Default value added

    @ManyToMany
    @JoinTable(
        name = "list_images",
        joinColumns = [JoinColumn(name = "list_id")],
        inverseJoinColumns = [JoinColumn(name = "image_id")]
    )
    val imageEntities: Set<ImageEntity> = HashSet()
)