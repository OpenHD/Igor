package org.openhdfpv.angularbackend.exporter

import org.openhdfpv.angularbackend.imager.ImagesListRepository
import org.openhdfpv.angularbackend.oscategory.OsCategoryRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.servlet.http.HttpServletRequest
import org.openhdfpv.angularbackend.imager.ImageListService
import org.springframework.security.access.prepost.PreAuthorize

@RestController
@RequestMapping("/api")
class DownloadListExporter(
    private val imagesListRepository: ImagesListRepository,
    private val imageListService: ImageListService

) {

    @PreAuthorize("permitAll()")
    @GetMapping("/image_list", "image_lists")
    fun getAvailableImageListEndpoints(): ResponseEntity<List<String>> {
        val endpoints = imagesListRepository.findAll().map { it.endpoint }
        return ResponseEntity.ok(endpoints)
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/image_list/{endpoint}")
    fun getImageListByEndpoint(
        @PathVariable endpoint: String,
        request: HttpServletRequest
    ): ResponseEntity<Map<String, Any>> {
        val response = imageListService.createImageListResponse(endpoint, request)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(response)
    }



    @GetMapping("/request")
    fun getRequestBodyAsJson(request: HttpServletRequest): ResponseEntity<Map<String, Any?>> {
        val headers = request.headerNames.toList().associateWith { request.getHeader(it) }
        val parameters = request.parameterMap.mapValues { it.value.joinToString(", ") }

        val requestBody = mapOf(
            "method" to request.method,
            "uri" to request.requestURI,
            "query_string" to request.queryString,
            "query_params" to parameters,
            "headers" to headers,
            "remote_addr" to request.remoteAddr,
            "remote_host" to request.remoteHost,
            "remote_port" to request.remotePort,
            "server_name" to request.serverName,
            "server_port" to request.serverPort,
            "context_path" to request.contextPath,
            "auth_type" to request.authType,
            "user_principal" to request.userPrincipal?.name,
            "requested_session_id" to request.requestedSessionId,
            "locale" to request.locale.toString(),
            "local_name" to request.localName,
            "local_port" to request.localPort,
            "scheme" to request.scheme,
            "protocol" to request.protocol,
            "secure" to request.isSecure
        )

        return ResponseEntity.ok(requestBody)
    }
}
