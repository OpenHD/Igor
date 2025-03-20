package org.openhdfpv.angularbackend.security



import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.security.Key
import java.util.*

@Service
class JwtUtil(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expirationMs: Long
) {
    private val key: Key = Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))

    fun generateToken(userDetails: UserDetails): String {
        val now = Date()
        val claims = mapOf(
            "sub" to userDetails.username,
            "roles" to userDetails.authorities.map { it.authority },
            "iat" to now,
            "exp" to Date(now.time + expirationMs)
        )

        return Jwts.builder()
            .setClaims(claims)
            .signWith(key, SignatureAlgorithm.HS256)
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
        return Jwts.parser() // statt .parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body
    }
}
