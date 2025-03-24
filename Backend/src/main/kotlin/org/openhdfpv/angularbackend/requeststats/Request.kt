package org.openhdfpv.angularbackend.requeststats

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "request")
open class Request(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) open var id: Long? = null,
    @Column(nullable = true) open var method: String? = null,
    @Column(nullable = true) open var type: String? = null, // NEUES Feld für den Request-Typ
    @Column(nullable = false) open var uri: String,
    @Column(nullable = true) open var queryParams: String? = null,
    @Column(columnDefinition = "TEXT") open var headers: String? = null,
    @Column(nullable = false) open var remoteAddr: String,
    @Column(nullable = true) open var userAgent: String? = null,
    @Column(nullable = true) open var scheme: String? = null,
    @Column(nullable = true) open var protocol: String? = null,
    @Column(nullable = true) open var secure: Boolean? = null,
    @Column(nullable = true) open var referer: String? = null,
    @Column(nullable = true) open var origin: String? = null,
    @Column(nullable = true) open var relatedEntityId: Long? = null,
    @Column(nullable = false, updatable = false) @CreationTimestamp open var timestamp: LocalDateTime = LocalDateTime.MIN,
    @Column(nullable = true) open var description: String? = null,
    @Column(nullable = false) open var clientIp: String,
    @Column(nullable = true) open var isTorExitNode: Boolean? = null,
    @Column(nullable = true) open var country: String? = null,
    @Column(nullable = true) open var countryCode: String? = null,
    @Column(nullable = true) open var city: String? = null,
    @Column(nullable = true) open var lat: Double? = null,
    @Column(nullable = true) open var lon: Double? = null,
    @Column(nullable = true) open var isp: String? = null,
    @Column(nullable = true) open var asn: String? = null,
    @Column(nullable = true) open var lastCheckedAt: LocalDateTime? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Request) return false
        if (id == null || other.id == null) return false
        return id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: 0

    override fun toString(): String = "Request(id=$id, uri='$uri', remoteAddr='$remoteAddr', clientIp='$clientIp', timestamp=$timestamp)"
}
