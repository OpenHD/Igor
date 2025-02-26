package org.openhdfpv.angularbackend.buildartefact

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.annotations.UuidGenerator
import org.openhdfpv.angularbackend.oscategory.OsCategory
import java.time.LocalDateTime
import java.util.*


@Entity
data class ImageEntity(
    @Id @org.hibernate.annotations.UuidGenerator(style = UuidGenerator.Style.AUTO)
    val id: UUID? = null,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var description: String,

    @Column(nullable = false)
    var icon: String,

    @Column(nullable = false)
    var url: String,

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "backup_urls", nullable = true)
    var backupUrls: List<String> = emptyList(),

    var extractSize: Long,

    @Column(name = "extract_sha256", nullable = true, unique = false)
    var extractSha256: String? = null,

    var imageDownloadSize: Long,

    val redirectsCount: Long = 0L,

    @Column(nullable = false)
    val releaseDate: String,

    var isEnabled: Boolean = true,

    val isDeleted: Boolean = false,

    var isAvailable: Boolean = false, // automatic periodically available checks

    @Column(nullable = false)
    val initFormat: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = true)
    val category: OsCategory? = null,

    // Erstellungszeitpunkt
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.MIN,

    // Aktualisierungszeitpunkt
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.MIN
)
