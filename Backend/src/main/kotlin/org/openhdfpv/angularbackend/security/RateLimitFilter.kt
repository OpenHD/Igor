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
        val uri = request.requestURI
        val protected = uri.startsWith("/download/") || uri == "/graphql"
        if (protected) {
            val key = buildKey(request)
            val userAgent = request.getHeader("User-Agent") ?: "Unknown User-Agent"
            val method = request.method
            val bucket = buckets.computeIfAbsent(key) { createNewBucket(uri) }
            if (!bucket.tryConsume(1)) {
                rateLimitLogger.info("Rate limit exceeded key=$key ua='$userAgent' method=$method uri=$uri")
                response.status = 429
                response.writer.write("Too many requests")
                return
            }
        }
        filterChain.doFilter(request, response)
    }

    private fun buildKey(request: HttpServletRequest): String =
        "${getClientIP(request)}:${request.requestURI}"

    private fun getClientIP(request: HttpServletRequest): String {
        val header = request.getHeader("CF-Connecting-IP") ?: request.getHeader("X-Forwarded-For")
        return header?.split(",")?.first()?.trim() ?: request.remoteAddr
    }

    private fun createNewBucket(uri: String): Bucket {
        // Tighter default for GraphQL to mitigate introspection / brute force
        val limit = if (uri == "/graphql") {
            Bandwidth.builder()
                .capacity(100)
                .refillIntervally(100, Duration.ofMinutes(1))
                .build()
        } else {
            Bandwidth.builder()
                .capacity(40)
                .refillIntervally(3, Duration.ofHours(1))
                .build()
        }
        return Bucket.builder().addLimit(limit).build()
    }
}
