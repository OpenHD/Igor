package org.openhdfpv.angularbackend.imager

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import java.time.LocalDateTime


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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "list_images",
        joinColumns = [JoinColumn(name = "list_id")],
        inverseJoinColumns = [JoinColumn(name = "image_id")]
    )
    val imageEntities: Set<ImageEntity> = HashSet(),

    // Erstellungszeitpunkt
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.MIN,

    // Aktualisierungszeitpunkt
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.MIN
)
