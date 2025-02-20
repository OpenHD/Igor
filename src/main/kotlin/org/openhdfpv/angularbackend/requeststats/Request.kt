package org.openhdfpv.angularbackend.requeststats

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
data class Request(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val method: String,

    @Column(nullable = false)
    val uri: String,

    @Column
    val queryParams: String? = null,

    @Column(columnDefinition = "TEXT")
    val headers: String? = null,

    @Column(nullable = false)
    val remoteAddr: String,

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    val timestamp: LocalDateTime = LocalDateTime.MIN
)