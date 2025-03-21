package org.openhdfpv.angularbackend.imager

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface ImagesListRepository : JpaRepository<ImagesList, Long> {

    fun findByName(name: String): Optional<ImagesList>
    fun findByEndpoint(endpoint: String): ImagesList?
    fun existsByName(name: String): Boolean
    fun findByImageEntitiesId(imageId: UUID): List<ImagesList>

    @Query("SELECT il FROM ImagesList il LEFT JOIN FETCH il.imageEntities WHERE il.endpoint = :endpoint")
    fun findByEndpointWithImages(@Param("endpoint") endpoint: String): ImagesList?
}

