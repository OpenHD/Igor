package org.openhdfpv.angularbackend.security

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Bucket4j
import io.github.bucket4j.Refill
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap

@Component
class RateLimitFilter : OncePerRequestFilter() {

    private val buckets = ConcurrentHashMap<String, Bucket>()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        if (request.requestURI.startsWith("/download/")) {
            val ip = getClientIP(request)
            val bucket = buckets.computeIfAbsent(ip) { createNewBucket() }

            if (!bucket.tryConsume(1)) {
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
        val limit = Bandwidth.classic(4, Refill.intervally(8, Duration.ofMinutes(1)))
        return Bucket4j.builder().addLimit(limit).build()
    }
}
