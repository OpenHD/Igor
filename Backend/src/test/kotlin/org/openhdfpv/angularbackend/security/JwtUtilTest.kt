package org.openhdfpv.angularbackend.security

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class JwtUtilTest {

    @Autowired
    lateinit var jwtUtil: JwtUtil

    @Test
    fun `generate and validate token`() {
        val user = User("alice", "pw", listOf(SimpleGrantedAuthority("ROLE_USER")))
        val token = jwtUtil.generateToken(user)
        assertTrue(jwtUtil.validateToken(token, user))
        assertEquals("alice", jwtUtil.extractUsername(token))
    }
}
