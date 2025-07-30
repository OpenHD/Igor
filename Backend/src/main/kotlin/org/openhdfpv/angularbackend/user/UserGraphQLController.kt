package org.openhdfpv.angularbackend.user

import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import java.util.*

@Controller
class UserGraphQLController(private val userService: UserService) {

    @QueryMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('OWNER')")
    fun users(): List<User> = userService.getAllUsers()

    @QueryMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('OWNER')")
    fun user(@Argument id: String): User? = 
        userService.getUserById(UUID.fromString(id))

    @MutationMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('OWNER')")
    fun createUser(@Argument input: UserInput): User {
        return userService.createUser(
            username = input.username,
            password = input.password,
            roles = input.roles.toSet()
        )
    }

    @MutationMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('OWNER')")
    fun updateUser(
        @Argument id: String,
        @Argument input: UserUpdateInput
    ): User {
        return userService.updateUser(
            id = UUID.fromString(id),
            username = input.username,
            roles = input.roles?.toSet()
        )
    }

    @MutationMapping
    @PreAuthorize("hasAuthority('OWNER')")
    fun updateUserPassword(
        @Argument id: String,
        @Argument newPassword: String
    ): User {
        return userService.updateUserPassword(UUID.fromString(id), newPassword)
    }

    @MutationMapping
    @PreAuthorize("hasAuthority('OWNER')")
    fun deleteUser(
        @Argument id: String,
        @AuthenticationPrincipal currentUser: User
    ): Boolean {
        return try {
            userService.deleteUser(UUID.fromString(id), currentUser)
            true
        } catch (e: Exception) {
            false
        }
    }
}

data class UserInput(
    val username: String,
    val password: String,
    val roles: List<Role>
)

data class UserUpdateInput(
    val username: String?,
    val roles: List<Role>?
)