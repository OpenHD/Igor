package org.openhdfpv.angularbackend.user

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*


@Entity
@Table(name = "users")
class User(
    @Column(unique = true)
    private var username: String,
    private var password: String,

    @ElementCollection(fetch = FetchType.EAGER, targetClass = Role::class)
    @CollectionTable(name = "user_roles", joinColumns = [JoinColumn(name = "user_id")])
    @Column(name = "roles")
    @Enumerated(EnumType.STRING)
    var roles: MutableSet<Role>,
) : UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    lateinit var id: UUID
        private set

    override fun getAuthorities(): Collection<GrantedAuthority> = roles
    override fun getUsername() = username
    override fun getPassword() = password
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
    
    // Methods for updating user properties
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
