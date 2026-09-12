package org.openhdfpv.angularbackend.user

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserPrincipal(private val user: User) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> = user.roles
    override fun getPassword(): String = user.getPassword()
    override fun getUsername(): String = user.getUsername()
    
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
    
    fun getUser(): User = user
}
