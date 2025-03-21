package org.openhdfpv.angularbackend.security

import org.openhdfpv.angularbackend.user.UserService
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
    private val userService: UserService,
    private val jwtUtil: JwtUtil
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationProvider(): AuthenticationProvider =
        DaoAuthenticationProvider().apply {
            setUserDetailsService(userService)
            setPasswordEncoder(passwordEncoder())
        }

    @Bean
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration): AuthenticationManager =
        authenticationConfiguration.authenticationManager

    @Bean
    fun securityFilterChain(http: HttpSecurity, corsProperties: CorsProperties): SecurityFilterChain {
        http
            .csrf { csrf -> csrf.disable() }
            .cors { cors -> cors.configurationSource(corsConfigurationSource(corsProperties)) }
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(
                        "/api/**",
                        "/image_list/**",
                        "/image_lists/**",
                        "/download/**",
                        "/graphiql",
                        "/graphql",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/actuator/health",
                        "/error"
                    ).permitAll()
                    .requestMatchers("/graphql").hasRole("USER")
                    .requestMatchers("/actuator/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            }
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(JwtFilter(jwtUtil, userService), UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }

    @Configuration
    @ConfigurationProperties(prefix = "cors")
    class CorsProperties {
        lateinit var allowedOrigins: String
        lateinit var allowedMethods: String
        lateinit var allowedHeaders: String
        var allowCredentials: Boolean = false
    }

    @Bean
    fun corsConfigurationSource(corsProperties: CorsProperties): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOriginPatterns = corsProperties.allowedOrigins.split(",").map { it.trim() }
            allowedMethods = corsProperties.allowedMethods.split(",").map { it.trim() }
            allowedHeaders = corsProperties.allowedHeaders.split(",").map { it.trim() }
            this.allowCredentials = corsProperties.allowCredentials
        }
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }



}
