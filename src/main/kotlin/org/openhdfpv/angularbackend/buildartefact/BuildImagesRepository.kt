package org.openhdfpv.angularbackend.buildartefact

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BuildImagesRepository : JpaRepository<ImageEntity, Long> {
    fun findByExtractSha256(extractSha256: String): ImageEntity?
}