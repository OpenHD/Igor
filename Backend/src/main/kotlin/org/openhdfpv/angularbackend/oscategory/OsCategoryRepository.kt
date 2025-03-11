package org.openhdfpv.angularbackend.oscategory

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface OsCategoryRepository : JpaRepository<OsCategory, Long> {
    fun findByName(name: String): OsCategory?

    @Modifying
    @Query("UPDATE OsCategory c SET c.position = c.position + 1")
    fun incrementAllPositions()

    @Modifying
    @Query("UPDATE OsCategory c SET c.position = c.position + 1 WHERE c.position >= :start AND c.position < :end")
    fun incrementPositionsBetween(start: Int, end: Int)

    @Modifying
    @Query("UPDATE OsCategory c SET c.position = c.position - 1 WHERE c.position > :start AND c.position <= :end")
    fun decrementPositionsBetween(start: Int, end: Int)

    fun findAllByOrderByPositionAsc(): List<OsCategory>

}
