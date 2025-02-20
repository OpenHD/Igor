package org.openhdfpv.angularbackend.buildartefact

import org.springframework.data.jpa.repository.JpaRepository

interface BuildImagesRepository : JpaRepository<ImageEntity, Long> {
    fun findByExtractSha256(extractSha256: String): ImageEntity?
}