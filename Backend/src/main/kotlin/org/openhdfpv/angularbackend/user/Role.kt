package org.openhdfpv.angularbackend.user

import org.springframework.security.core.GrantedAuthority

enum class Role : GrantedAuthority {
    USER, ADMIN;

    override fun getAuthority(): String = name
}
