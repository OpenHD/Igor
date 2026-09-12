package org.openhdfpv.angularbackend.user

import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Profile("!test")
class UserInitializer(
    private val userRepository: UserPersistenceRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userProperties: UserProperties
) : ApplicationRunner {

    @Transactional
    override fun run(args: ApplicationArguments) {
        val name = userProperties.username ?: "admin"
        val existing = userRepository.findByUsername(name)
        if (existing == null) {
            val pass = userProperties.password ?: "password"
            val roles = (userProperties.roles ?: emptyList()).map { Role.valueOf(it) }.toMutableSet()
            val newUser = User(name, passwordEncoder.encode(pass)!!, roles)
            userRepository.save(newUser)
        }
    }
}

@Component
@ConfigurationProperties(prefix = "default-user")
class UserProperties {
    var username: String? = null
    var password: String? = null
    var roles: List<String>? = null
}
