package org.openhdfpv.angularbackend.oscategory

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "os_category")
open class OsCategory(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) open var id: Long? = null,
    @Column(nullable = false, unique = true) open var name: String = "",
    @Column(nullable = false) open var description: String = "",
    @Column(nullable = false) open var icon: String = "",
    @Column(nullable = false) open var position: Int = 0,
    @Column(name = "created_at", nullable = false, updatable = false) @CreationTimestamp open var createdAt: LocalDateTime = LocalDateTime.MIN,
    @Column(name = "updated_at", nullable = false) @UpdateTimestamp open var updatedAt: LocalDateTime = LocalDateTime.MIN
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OsCategory) return false
        if (id == null || other.id == null) return false
        return id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: 0

    override fun toString(): String =
        "OsCategory(id=$id, name='$name', description='$description', icon='$icon', position=$position)"
}
