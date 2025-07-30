package org.openhdfpv.angularbackend.user

import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : UserDetailsService {

    override fun loadUserByUsername(username: String) =
        userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found")

    fun getAllUsers(): List<User> = userRepository.findAll()

    fun getUserById(id: UUID): User? = userRepository.findById(id).orElse(null)

    @Transactional
    fun createUser(username: String, password: String, roles: Set<Role>): User {
        if (userRepository.findByUsername(username) != null) {
            throw IllegalArgumentException("User with username '$username' already exists")
        }
        
        val user = User(
            username = username,
            password = passwordEncoder.encode(password),
            roles = roles.toMutableSet()
        )
        return userRepository.save(user)
    }

    @Transactional
    fun updateUser(id: UUID, username: String?, roles: Set<Role>?): User {
        val user = userRepository.findById(id).orElseThrow { 
            IllegalArgumentException("User not found") 
        }
        
        // Prevent changing username to existing one
        if (username != null && username != user.username) {
            if (userRepository.findByUsername(username) != null) {
                throw IllegalArgumentException("Username already exists")
            }
        }
        
        if (username != null) {
            user.updateUsername(username)
        }
        if (roles != null) {
            user.updateRoles(roles)
        }
        return userRepository.save(user)
    }

    @Transactional  
    fun updateUserPassword(id: UUID, newPassword: String): User {
        val user = userRepository.findById(id).orElseThrow { 
            IllegalArgumentException("User not found") 
        }
        
        user.updatePassword(passwordEncoder.encode(newPassword))
        return userRepository.save(user)
    }

    @Transactional
    fun deleteUser(id: UUID, currentUser: User) {
        val userToDelete = userRepository.findById(id).orElseThrow { 
            IllegalArgumentException("User not found") 
        }
        
        // Prevent deletion of OWNER users
        if (userToDelete.roles.any { it.isOwner() }) {
            throw IllegalArgumentException("OWNER users cannot be deleted")
        }
        
        // Prevent self-deletion
        if (userToDelete.id == currentUser.id) {
            throw IllegalArgumentException("Cannot delete yourself")
        }
        
        // Only OWNER can delete users
        if (!currentUser.roles.any { it.canDeleteUsers() }) {
            throw IllegalArgumentException("Only OWNER can delete users")
        }
        
        userRepository.delete(userToDelete)
    }
    
    fun canManageUsers(user: User): Boolean = 
        user.roles.any { it.canManageUsers() }
        
    fun isOwner(user: User): Boolean = 
        user.roles.any { it.isOwner() }
}
