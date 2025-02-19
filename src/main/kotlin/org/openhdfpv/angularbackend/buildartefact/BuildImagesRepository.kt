package org.openhdfpv.angularbackend.buildartefact

import org.springframework.data.jpa.repository.JpaRepository

interface BuildImagesRepository : JpaRepository<ImageEntity, Long> {
}