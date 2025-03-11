package org.openhdfpv.angularbackend.requeststats

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
data class Request(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
    @Column(nullable = true) val method: String? = null,
    @Column(nullable = true) val type: String? = null, // NEUES Feld für den Request-Typ
    @Column(nullable = false) val uri: String,
    @Column val queryParams: String? = null,
    @Column(columnDefinition = "TEXT") val headers: String? = null,
    @Column(nullable = false) val remoteAddr: String,
    @Column(nullable = true) val userAgent: String? = null,
    @Column(nullable = true) val scheme: String? = null,
    @Column(nullable = true) val protocol: String? = null,
    @Column(nullable = true) val secure: Boolean? = null,
    @Column(nullable = true) val referer: String? = null,
    @Column(nullable = true) val origin: String? = null, // Das neue Feld für die Herkunft
    @Column(nullable = true) val relatedEntityId: Long? = null, // NEUES Feld zur Speicherung von IDs der verknüpften Entität
    @Column(nullable = false, updatable = false) @CreationTimestamp val timestamp: LocalDateTime = LocalDateTime.MIN,
    val description: String? = null,

    @Column(nullable = false) val clientIp: String,
    @Column(nullable = true) var isTorExitNode: Boolean? = null,
    @Column(nullable = true) var country: String? = null,
    @Column(nullable = true) var countryCode: String? = null,
    @Column(nullable = true) var city: String? = null,
    @Column(nullable = true) var lat: Double? = null,
    @Column(nullable = true) var lon: Double? = null,
    @Column(nullable = true) var isp: String? = null,
    @Column(nullable = true) var asn: String? = null,
    @Column(nullable = true) var lastCheckedAt: LocalDateTime? = null
)
