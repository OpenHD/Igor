package org.openhdfpv.angularbackend.oscategory

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OsCategoryRepository : JpaRepository<OsCategory, Long> {
    fun findByName(name: String): OsCategory?
}