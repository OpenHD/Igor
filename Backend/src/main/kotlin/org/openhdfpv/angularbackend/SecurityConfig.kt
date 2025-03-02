package org.openhdfpv.angularbackend

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Aktiviert Annotation-basierte Sicherheit
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { csrf -> csrf.disable() } // TODO: Deaktiviert CSRF vorübergehend
            .cors { cors -> cors.disable() } // TODO: Deaktiviert CORS vorübergehend
            .authorizeHttpRequests { auth ->
                auth
                    .anyRequest().permitAll() // Erlaubt alle Requests
            }
            .httpBasic { }

        return http.build()
    }

}
