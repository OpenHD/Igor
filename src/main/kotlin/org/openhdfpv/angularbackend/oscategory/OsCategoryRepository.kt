package org.openhdfpv.angularbackend.oscategory

import org.springframework.data.jpa.repository.JpaRepository

interface OsCategoryRepository : JpaRepository<OsCategory, Long> {
}