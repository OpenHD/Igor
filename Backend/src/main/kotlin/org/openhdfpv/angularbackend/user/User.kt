package org.openhdfpv.angularbackend.user

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*


@Entity
@Table(name = "users")
class User(
    @Column(unique = true)
    private val username: String,
    private val password: String,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = [JoinColumn(name = "user_id")])
    @Enumerated(EnumType.STRING)
    val roles: Set<Role>,
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
}
