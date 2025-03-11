package org.openhdfpv.angularbackend.requeststats

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RequestController(
    private val requestRepository: RequestRepository
) {

    @GetMapping("/requests")
    fun getAllRequests(): List<Request> {
        return requestRepository.findAll()
    }

    @GetMapping("/requests/tor")
    fun getTorRequests(): List<Request> {
        return requestRepository.findByIsTorExitNodeTrue()
    }
}
