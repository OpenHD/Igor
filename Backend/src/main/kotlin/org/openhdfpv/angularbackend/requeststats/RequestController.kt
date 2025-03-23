package org.openhdfpv.angularbackend.requeststats

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RequestController(
    private val requestService: RequestService
) {

    @GetMapping("/requests")
    fun getAllRequests(
        @PageableDefault(size = 1000) pageable: Pageable
    ): Page<Request> {
        return requestService.getAllRequests(pageable)
    }

    @GetMapping("/requests/tor")
    fun getTorRequests(
        @PageableDefault(size = 1000) pageable: Pageable
    ): Page<Request> {
        return requestService.getTorRequests(pageable)
    }
}
