package org.openhdfpv.angularbackend.buildartefact

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BuildImagesRepository : JpaRepository<ImageEntity, UUID> {
    fun findByExtractSha256(extractSha256: String): ImageEntity?

    fun findByIsDeletedFalse(): List<ImageEntity>


}
