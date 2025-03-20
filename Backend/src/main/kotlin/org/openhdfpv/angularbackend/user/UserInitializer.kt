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
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userProperties: UserProperties
) : ApplicationRunner {

    @Transactional
    override fun run(args: ApplicationArguments?) {
        if (userRepository.findByUsername(userProperties.username) == null) {
            userRepository.save(
                User(
                    username = userProperties.username,
                    password = passwordEncoder.encode(userProperties.password),
                    roles = userProperties.roles.map { Role.valueOf(it) }.toSet()
                )
            )
        }
    }
}

@Component
@ConfigurationProperties(prefix = "default-user")
class UserProperties {
    lateinit var username: String
    lateinit var password: String
    lateinit var roles: List<String>
}
