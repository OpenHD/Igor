package org.openhdfpv.angularbackend.oscategory

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime


@Entity
data class OsCategory(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    var name: String = "", // Default added

    @Column(nullable = false)
    var description: String = "", // Default added

    @Column(nullable = false)
    var icon: String = "", // Default added

    @Column(nullable = false)
    var position: Int = 0,

    // Erstellungszeitpunkt
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.MIN,

    // Aktualisierungszeitpunkt
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.MIN
)
