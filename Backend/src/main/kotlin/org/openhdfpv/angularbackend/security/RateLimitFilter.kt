package org.openhdfpv.angularbackend.security

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Refill
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap

@Component
class RateLimitFilter : OncePerRequestFilter() {

    // Umbenennen, um Namenskonflikte mit der Basisklasse zu vermeiden
    private val rateLimitLogger = LoggerFactory.getLogger(RateLimitFilter::class.java)
    private val buckets = ConcurrentHashMap<String, Bucket>()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        if (request.requestURI.startsWith("/download/")) {
            val ip = getClientIP(request)
            val userAgent = request.getHeader("User-Agent") ?: "Unknown User-Agent"
            val requestMethod = request.method
            val requestURI = request.requestURI
            val bucket = buckets.computeIfAbsent(ip) { createNewBucket() }

            if (!bucket.tryConsume(1)) {
                rateLimitLogger.info("Rate limit exceeded for IP: $ip, User-Agent: $userAgent, Method: $requestMethod, Endpoint: $requestURI")
                response.status = 429
                response.writer.write("Too many requests")
                return
            }
        }
        filterChain.doFilter(request, response)
    }

    private fun getClientIP(request: HttpServletRequest): String {
        val header = request.getHeader("CF-Connecting-IP") ?: request.getHeader("X-Forwarded-For")
        return header?.split(",")?.first()?.trim() ?: request.remoteAddr
    }

    private fun createNewBucket(): Bucket {
        val limit = Bandwidth.classic(20, Refill.intervally(2, Duration.ofHours(1)))
        return Bucket.builder().addLimit(limit).build()
    }
}
