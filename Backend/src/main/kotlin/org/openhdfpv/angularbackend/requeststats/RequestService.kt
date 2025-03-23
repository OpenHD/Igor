package org.openhdfpv.angularbackend.requeststats

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class RequestService(private val requestRepository: RequestRepository) {

    fun getAllRequests(pageable: Pageable): Page<Request> {
        return requestRepository.findAll(pageable)
    }

    fun getTorRequests(pageable: Pageable): Page<Request> {
        return requestRepository.findByIsTorExitNodeTrue(pageable)
    }
}
