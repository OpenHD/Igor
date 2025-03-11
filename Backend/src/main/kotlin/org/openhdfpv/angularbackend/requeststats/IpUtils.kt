package org.openhdfpv.angularbackend.requeststats

import jakarta.servlet.http.HttpServletRequest

object IpUtils {
    fun resolveClientIp(request: HttpServletRequest): String {
        val proxyHeaders = listOf(
            "CF-Connecting-IP",
            "X-Forwarded-For",
            "X-Real-IP",
            "Forwarded"
        )

        return proxyHeaders
            .firstNotNullOfOrNull { request.getHeader(it) }
            ?.split(',')
            ?.firstOrNull()
            ?.trim()
            ?: request.remoteAddr
    }
}
