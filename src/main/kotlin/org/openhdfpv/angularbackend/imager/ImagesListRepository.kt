package org.openhdfpv.angularbackend.imager

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface ImagesListRepository : JpaRepository<ImagesList, Long> {
}