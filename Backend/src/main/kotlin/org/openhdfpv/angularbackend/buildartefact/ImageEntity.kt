package org.openhdfpv.angularbackend.buildartefact

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.annotations.UuidGenerator
import org.openhdfpv.angularbackend.oscategory.OsCategory
import java.net.URI
import java.time.LocalDateTime
import java.util.*


@Entity
data class ImageEntity(
    @Id @UuidGenerator(style = UuidGenerator.Style.AUTO) val id: UUID? = null,
    @Column(nullable = false) var name: String,
    @Column(nullable = false) var description: String,
    @Column(nullable = false) var icon: String,
    @ElementCollection(fetch = FetchType.EAGER) @CollectionTable(name = "image_urls", joinColumns = [JoinColumn(name = "image_id")]) var urls: List<ImageUrl> = emptyList(),
    var extractSize: Long,
    @Column(name = "extract_sha256", nullable = true, unique = false) var extractSha256: String? = null,
    var imageDownloadSize: Long,
    @ElementCollection(fetch = FetchType.EAGER) @Column(name = "backup_urls", nullable = true) var backupUrls: List<String> = emptyList(),
    var redirectsCount: Long = 0L,
    @Column(nullable = false) var releaseDate: String,
    var isEnabled: Boolean = true,
    val isDeleted: Boolean = false,
    var position: Int = 0,
    @Column(nullable = false) val initFormat: String,
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_id", nullable = true) var category: OsCategory? = null,
    @Column(name = "created_at", nullable = false, updatable = false) @CreationTimestamp val createdAt: LocalDateTime = LocalDateTime.MIN,
    @Column(name = "updated_at", nullable = false) @UpdateTimestamp val updatedAt: LocalDateTime = LocalDateTime.MIN
) {

    fun getCurrentAvailableUrl(): String? {
        // Zuerst wird nach der als default markierten und verfügbaren URL gesucht
        val defaultAvailable = urls.firstOrNull { it.isDefault && it.isAvailable }
        if (defaultAvailable != null) {
            return defaultAvailable.url
        }
        // Falls keine default URL verfügbar ist, wird eine beliebige verfügbare URL gesucht
        return urls.firstOrNull { it.isAvailable }?.url
    }

    fun getAvailable(): Boolean {
        return getCurrentAvailableUrl() != null
    }

    fun getUrlByFilename(filename: String): String? {
        return urls
            .asSequence()
            .filter { it.isAvailable }
            .sortedByDescending { it.isDefault }
            .firstOrNull { url ->
                val urlFilename = url.url.substringAfterLast('/')
                urlFilename.equals(filename, ignoreCase = true)
            }?.url
    }

    fun getCurrentAvailableFilename(): String? {
        return getCurrentAvailableUrl()?.substringAfterLast('/')
    }

    fun getAvailableUrlsCount(): Pair<Int, Int> {
        val availableCount = urls.count { it.isAvailable }
        val totalCount = urls.size
        return Pair(availableCount, totalCount)
    }

    fun getUrlsAsJson(): String {
        return jacksonObjectMapper().writeValueAsString(urls)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as ImageEntity
        return id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: 0
}

@Embeddable
data class ImageUrl(
    @Column(nullable = false)
    var url: String,

    // Gibt an, ob diese URL aktuell erreichbar ist
    var isAvailable: Boolean = false,

    // Kennzeichnet, ob es sich um die Standard-URL handelt
    var isDefault: Boolean = false
)
