package org.openhdfpv.angularbackend.buildartefact

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.annotations.UuidGenerator
import org.openhdfpv.angularbackend.oscategory.OsCategory
import java.time.LocalDateTime
import java.util.*

@Entity
open class ImageEntity(
    @Id @UuidGenerator(style = UuidGenerator.Style.AUTO) open var id: UUID? = null,
    @Column(nullable = false) open var name: String,
    @Column(nullable = false) open var description: String,
    @Column(nullable = false) open var icon: String,
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "image_urls", joinColumns = [JoinColumn(name = "image_id")])
    open var urls: MutableList<ImageUrl> = mutableListOf(),
    open var extractSize: Long,
    @Column(name = "extract_sha256", nullable = true, unique = false) open var extractSha256: String? = null,
    open var imageDownloadSize: Long,
    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "backup_urls", nullable = true) open var backupUrls: List<String> = emptyList(),
    open var redirectsCount: Long = 0L,
    @Column(nullable = false) open var releaseDate: String,
    open var isEnabled: Boolean = true,
    open var isDeleted: Boolean = false,
    open var position: Int = 0,
    @Column(nullable = false) open var initFormat: String,
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_id", nullable = true)
    open var category: OsCategory? = null,
    @Column(name = "created_at", nullable = false, updatable = false) @CreationTimestamp
    open var createdAt: LocalDateTime = LocalDateTime.MIN,
    @Column(name = "updated_at", nullable = false) @UpdateTimestamp
    open var updatedAt: LocalDateTime = LocalDateTime.MIN
) {

    fun getCurrentAvailableUrl(): String? {
        val defaultAvailable = urls.firstOrNull { it.isDefault && it.isAvailable }
        if (defaultAvailable != null) {
            return defaultAvailable.url
        }
        return urls.firstOrNull { it.isAvailable }?.url
    }

    fun getAvailable(): Boolean = getCurrentAvailableUrl() != null

    fun getUrlByFilename(filename: String): String? {
        return urls.asSequence()
            .filter { it.isAvailable }
            .sortedByDescending { it.isDefault }
            .firstOrNull { url ->
                val urlFilename = url.url.substringAfterLast('/')
                urlFilename.equals(filename, ignoreCase = true)
            }?.url
    }

    fun getCurrentAvailableFilename(): String? = getCurrentAvailableUrl()?.substringAfterLast('/')

    fun getAvailableUrlsCount(): Pair<Int, Int> {
        val availableCount = urls.count { it.isAvailable }
        val totalCount = urls.size
        return Pair(availableCount, totalCount)
    }

    fun getUrlsAsJson(): String = jacksonObjectMapper().writeValueAsString(urls)

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ImageEntity) return false
        if (id == null || other.id == null) return false
        return id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: 0
}
