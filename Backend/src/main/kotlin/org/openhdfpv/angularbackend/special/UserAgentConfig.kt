package org.openhdfpv.angularbackend.special

import nl.basjes.parse.useragent.UserAgentAnalyzer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UserAgentConfig {

    @Bean
    fun userAgentAnalyzer(): UserAgentAnalyzer {
        return UserAgentAnalyzer
            .newBuilder()
            .hideMatcherLoadStats() // optional
            .withCache(1000)
            .build()
    }
}
