package org.openhdfpv.angularbackend.user

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*

@Entity
@Table(name = "users")
class User(
    @Column(unique = true, nullable = false)
    private var username: String = "",

    @Column(nullable = false)
    private var password: String = "",

    @ElementCollection(fetch = FetchType.EAGER, targetClass = Role::class)
    @CollectionTable(name = "user_roles", joinColumns = [JoinColumn(name = "user_id")])
    @Column(name = "roles")
    @Enumerated(EnumType.STRING)
    var roles: MutableSet<Role> = mutableSetOf()
) {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null

    fun getUsername(): String = username
    fun getPassword(): String = password
    
    fun updateUsername(newUsername: String) {
        this.username = newUsername
    }
    
    fun updatePassword(newPassword: String) {
        this.password = newPassword
    }
    
    fun updateRoles(newRoles: Set<Role>) {
        this.roles.clear()
        this.roles.addAll(newRoles)
    }
}
