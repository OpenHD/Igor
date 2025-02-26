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

        // Argumente der Methode prüfen (z. B. Datei-ID oder SHA256-Wert)
        val args = joinPoint.args
        val relatedEntityId: Long? = args.firstOrNull { it is Long } as? Long

        // Logik zur Speicherung der Metadaten
        val request = Request(
            method = httpServletRequest.method,
            uri = httpServletRequest.requestURI,
            queryParams = httpServletRequest.queryString,
            headers = httpServletRequest.headerNames.toList()
                .joinToString { "${it}: ${httpServletRequest.getHeader(it)}" },
            remoteAddr = httpServletRequest.remoteAddr,
            userAgent = httpServletRequest.getHeader("User-Agent"),
            scheme = httpServletRequest.scheme,
            protocol = httpServletRequest.protocol,
            secure = httpServletRequest.isSecure,
            referer = httpServletRequest.getHeader("Referer"),
            origin = logRequest.origin, // Herkunft aus Annotation
            type = logRequest.type, // Typ aus Annotation
            relatedEntityId = if (logRequest.relatedEntity) relatedEntityId else null, // Nur wenn erlaubt
            description = logRequest.description
        )

        // Speichern in der Datenbank
        requestRepository.save(request)

        return result // Rückgabe des eigentlichen Ergebnisses
    }
}
