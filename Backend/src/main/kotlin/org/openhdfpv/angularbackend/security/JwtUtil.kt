package org.openhdfpv.angularbackend.security



import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.util.Assert
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import javax.crypto.SecretKey
import java.util.*

@Service
class JwtUtil(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expirationMs: Long
) {
    private val key: SecretKey

    init {
        // Enforce at least 256-bit (32 bytes) for HS256; prefer 512-bit for extra margin
        val bytes = secret.toByteArray(StandardCharsets.UTF_8)
        Assert.isTrue(bytes.size >= 32) { "jwt.secret must be at least 32 bytes (256 bits) long; currently=${bytes.size}" }
        key = Keys.hmacShaKeyFor(bytes)
    }

    fun generateToken(userDetails: UserDetails): String {
        val now = Date()
        val claims = mapOf(
            "sub" to userDetails.username,
            "roles" to userDetails.authorities.map { it.authority },
            "iat" to now,
            "exp" to Date(now.time + expirationMs)
        )

        return Jwts.builder()
            .claims(claims)
            .signWith(key)
            .compact()
    }

    fun extractUsername(token: String): String {
        return getClaims(token).subject
    }

    fun validateToken(token: String, userDetails: UserDetails): Boolean {
        return extractUsername(token) == userDetails.username && !isTokenExpired(token)
    }

    private fun isTokenExpired(token: String): Boolean {
        return getClaims(token).expiration.before(Date())
    }

    private fun getClaims(token: String): Claims {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
    }
}
