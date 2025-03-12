package org.openhdfpv.angularbackend.imager

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.openhdfpv.angularbackend.buildartefact.ImageEntity
import java.time.LocalDateTime


@Entity
data class ImagesList(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
    @Column(nullable = false) var latestVersion: String = "", // Default value added
    @Column(nullable = false) var url: String = "", // Default value added
    @Column(nullable = false, unique = true) var name: String = "", // Default value added
    @Column(nullable = false, unique = true) var endpoint: String = "", // Default value added
    @Column(nullable = false) var description: String = "", // Default value added
    @ManyToMany(fetch = FetchType.EAGER) @JoinTable(
        name = "list_images",
        joinColumns = [JoinColumn(name = "list_id")],
        inverseJoinColumns = [JoinColumn(name = "image_id")]
    ) var imageEntities: Set<ImageEntity> = HashSet(),
    @Column(name = "created_at", nullable = false, updatable = false) @CreationTimestamp val createdAt: LocalDateTime = LocalDateTime.MIN,
    @Column(name = "updated_at", nullable = false) @UpdateTimestamp val updatedAt: LocalDateTime = LocalDateTime.MIN
){
    fun updateFromInput(input: ImagesListInput, imageEntities: Set<ImageEntity>) {
        this.latestVersion = input.latestVersion
        this.url = input.url
        this.name = input.name
        this.endpoint = input.endpoint
        this.description = input.description
        this.imageEntities = imageEntities
    }

    fun updateFromPartialInput(input: ImagesListPartialInput) {
        input.latestVersion?.let { this.latestVersion = it }
        input.url?.let { this.url = it }
        input.name?.let { this.name = it }
        input.endpoint?.let { this.endpoint = it }
        input.description?.let { this.description = it }
    }
}
