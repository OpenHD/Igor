package org.openhdfpv.angularbackend.imager

import org.springframework.data.jpa.repository.JpaRepository


interface ImagesListRepository : JpaRepository<ImagesList, Long> {
}