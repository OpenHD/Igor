package org.openhdfpv.angularbackend.exporter

import org.openhdfpv.angularbackend.imager.ImagesListRepository
import org.openhdfpv.angularbackend.oscategory.OsCategoryRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.access.prepost.PreAuthorize

@RestController
@RequestMapping("/api")
class DownloadListExporter(
    private val imagesListRepository: ImagesListRepository
) {

    @PreAuthorize("permitAll()")
    @GetMapping("/image_list")
    fun getAvailableImageListEndpoints(): ResponseEntity<List<String>> {
        val endpoints = imagesListRepository.findAll().map { it.endpoint }
        return ResponseEntity.ok(endpoints)
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/image_list/{endpoint}")
    fun getImageListByEndpoint(@PathVariable endpoint: String): ResponseEntity<Map<String, Any>> {
        val imagesList = imagesListRepository.findAll().find { it.endpoint == endpoint }
            ?: return ResponseEntity.notFound().build()

        val response = mapOf(
            "imager" to mapOf(
                "latest_version" to imagesList.latestVersion,
                "url" to imagesList.url
            ),
            "os_list" to imagesList.imageEntities.groupBy { it.category }
                .map { (category, imageEntities) ->
                    mapOf(
                        "name" to category.name,
                        "description" to category.description,
                        "icon" to category.icon,
                        "subitems" to imageEntities.map { imageEntity ->
                            mapOf(
                                "name" to imageEntity.name,
                                "description" to imageEntity.description,
                                "icon" to imageEntity.icon,
                                "url" to imageEntity.url,
                                "extract_size" to imageEntity.extractSize,
                                "extract_sha256" to imageEntity.extractSha256,
                                "image_download_size" to imageEntity.imageDownloadSize,
                                "release_date" to imageEntity.releaseDate,
                                "init_format" to imageEntity.initFormat
                            )
                        }
                    )
                }
        )
        return ResponseEntity.ok(response)
    }

    @GetMapping("/request/json")
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