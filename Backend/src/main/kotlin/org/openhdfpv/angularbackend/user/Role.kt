package org.openhdfpv.angularbackend.user

import org.springframework.security.core.GrantedAuthority

enum class Role : GrantedAuthority {
    USER, ADMIN, OWNER;

    override fun getAuthority(): String = name
    
    fun canManageUsers(): Boolean = this == ADMIN || this == OWNER
    fun canDeleteUsers(): Boolean = this == OWNER
    fun isOwner(): Boolean = this == OWNER
}
