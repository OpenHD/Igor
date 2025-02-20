package org.openhdfpv.angularbackend.buildartefact

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.openhdfpv.angularbackend.oscategory.OsCategory
import java.time.LocalDateTime


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

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "backup_urls", nullable = true)
    val backupUrls: List<String> = emptyList(),

    val extractSize: Long,

    @Column(name = "extract_sha256", nullable = false, unique = true)
    val extractSha256: String,

    val imageDownloadSize: Long,

    val redirectsCount: Long = 0L,

    @Column(nullable = false)
    val releaseDate: String,

    val isEnabled: Boolean = true,

    @Column(nullable = false)
    val initFormat: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    val category: OsCategory,

    // Erstellungszeitpunkt
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.MIN,

    // Aktualisierungszeitpunkt
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.MIN
)