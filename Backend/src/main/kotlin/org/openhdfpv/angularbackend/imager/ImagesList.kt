package org.openhdfpv.angularbackend.imager

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import java.time.LocalDateTime

@Entity
@Table(name = "images_list")
open class ImagesList(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long? = null,
    @Column(nullable = false)
    open var latestVersion: String = "",
    @Column(nullable = false)
    open var url: String = "",
    @Column(nullable = false, unique = true)
    open var name: String = "",
    @Column(nullable = false, unique = true)
    open var endpoint: String = "",
    @Column(nullable = false)
    open var description: String = "",
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "list_images",
        joinColumns = [JoinColumn(name = "list_id")],
        inverseJoinColumns = [JoinColumn(name = "image_id")]
    )
    // Use a concrete generic type (MutableSet) to avoid raw type issues.
    open var imageEntities: MutableSet<ImageEntity> = mutableSetOf(),
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    open var createdAt: LocalDateTime = LocalDateTime.MIN,
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    open var updatedAt: LocalDateTime = LocalDateTime.MIN
)
{

    fun updateFromInput(input: ImagesListInput, imageEntities: Set<ImageEntity>) {
        this.latestVersion = input.latestVersion
        this.url = input.url
        this.name = input.name
        this.endpoint = input.endpoint
        this.description = input.description
        this.imageEntities = imageEntities.toMutableSet() // Convert to MutableSet
    }


    fun updateFromPartialInput(input: ImagesListPartialInput) {
        input.latestVersion?.let { this.latestVersion = it }
        input.url?.let { this.url = it }
        input.name?.let { this.name = it }
        input.endpoint?.let { this.endpoint = it }
        input.description?.let { this.description = it }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ImagesList) return false
        if (id == null || other.id == null) return false
        return id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: 0

    override fun toString(): String =
        "ImagesList(id=$id, latestVersion='$latestVersion', url='$url', name='$name', endpoint='$endpoint', description='$description')"
}
