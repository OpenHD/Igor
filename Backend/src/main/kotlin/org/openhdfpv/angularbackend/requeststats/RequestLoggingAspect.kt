package org.openhdfpv.angularbackend.requeststats

import jakarta.servlet.http.HttpServletRequest
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.stereotype.Component

@Aspect
@Component
class RequestLoggingAspect(
    private val requestRepository: RequestRepository,
    private val httpServletRequest: HttpServletRequest
) {

    @Around("@annotation(logRequest)")
    fun logRequest(joinPoint: ProceedingJoinPoint, logRequest: LogRequest): Any? {
        val result = joinPoint.proceed()
        val args = joinPoint.args

        val request = Request(
            method = httpServletRequest.method,
            type = logRequest.type,
            uri = httpServletRequest.requestURI,
            queryParams = httpServletRequest.queryString.takeIf { !it.isNullOrEmpty() },
            headers = extractHeaders(),
            remoteAddr = httpServletRequest.remoteAddr,
            clientIp = IpUtils.resolveClientIp(httpServletRequest), // Wichtig!
            userAgent = httpServletRequest.getHeader("User-Agent"),
            scheme = httpServletRequest.scheme,
            protocol = httpServletRequest.protocol,
            secure = httpServletRequest.isSecure,
            referer = httpServletRequest.getHeader("Referer"),
            origin = logRequest.origin,
            relatedEntityId = resolveRelatedEntityId(logRequest, args),
            description = logRequest.description,
            // Neue Felder initialisieren
            isTorExitNode = null,
            country = null,
            city = null,
            lastCheckedAt = null
        )

        requestRepository.save(request)
        return result
    }

    private fun extractHeaders(): String {
        return httpServletRequest.headerNames
            .toList()
            .joinToString(";") { "$it=${httpServletRequest.getHeader(it)}" }
    }

    private fun resolveRelatedEntityId(logRequest: LogRequest, args: Array<Any>): Long? {
        return if (logRequest.relatedEntity) {
            args.filterIsInstance<Long>().firstOrNull()
        } else null
    }
}
