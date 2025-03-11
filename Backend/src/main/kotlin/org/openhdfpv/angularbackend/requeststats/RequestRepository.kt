package org.openhdfpv.angularbackend.requeststats

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RequestRepository : JpaRepository<Request, Long> {
    fun findByLastCheckedAtIsNull(): List<Request>
    fun findByCountryCode(code: String): List<Request>
    fun findByAsn(asn: String): List<Request>
    fun findByIsTorExitNodeTrue(): List<Request>
}
