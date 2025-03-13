package org.openhdfpv.angularbackend.buildartefact

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BuildImagesRepository : JpaRepository<ImageEntity, UUID> {
    fun findByExtractSha256(extractSha256: String): ImageEntity?

    fun findByIsDeletedFalse(): List<ImageEntity>

    @Query(
        """
    SELECT i.* FROM image_entity i
    JOIN image_urls u ON i.id = u.image_id
    WHERE 
        i.is_deleted = false 
        AND u.is_available = true 
        AND split_part(u.url, '/', -1) = :filename
    """,
        nativeQuery = true
    )
    fun findByFilenameCustomQuery(@Param("filename") filename: String): ImageEntity?


}
