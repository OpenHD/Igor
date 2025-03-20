package org.openhdfpv.angularbackend.user

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user")
class UserController {

    @GetMapping
    fun getCurrentUser(@AuthenticationPrincipal user: UserDetails): Map<String, Any> {
        return mapOf(
            "username" to user.username,
            "roles" to user.authorities.map { it.authority }
        )
    }
}
