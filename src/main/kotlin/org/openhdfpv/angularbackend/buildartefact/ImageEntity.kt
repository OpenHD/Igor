package org.openhdfpv.angularbackend.buildartefact

import jakarta.persistence.*
import org.openhdfpv.angularbackend.imager.ImagesList
import org.openhdfpv.angularbackend.oscategory.OsCategory
import java.util.*


@Entity
data class ImageEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val description: String,

    @Column(nullable = false)
    val icon: String,

    @Column(nullable = false)
    val url: String,

    val extractSize: Long,

    val extractSha256: String,

    val imageDownloadSize: Long,

    @Column(nullable = false)
    val releaseDate: String,

    @Column(nullable = false)
    val initFormat: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    val category: OsCategory
)