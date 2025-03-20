package org.openhdfpv.angularbackend.security

import org.openhdfpv.angularbackend.user.UserService
import org.springframework.http.ResponseEntity

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userService: UserService,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/login")
    fun login(@RequestBody authRequest: AuthRequest): ResponseEntity<AuthResponse> {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(authRequest.username, authRequest.password)
        )
        val userDetails = userService.loadUserByUsername(authRequest.username)
        val token = jwtUtil.generateToken(userDetails)
        return ResponseEntity.ok(AuthResponse(token))
    }
}

data class AuthRequest(val username: String, val password: String)
data class AuthResponse(val token: String)
