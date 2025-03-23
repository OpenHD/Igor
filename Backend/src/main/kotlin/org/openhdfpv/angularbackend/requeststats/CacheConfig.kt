package org.openhdfpv.angularbackend.requeststats

import com.github.benmanes.caffeine.cache.Caffeine
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


import org.springframework.cache.caffeine.CaffeineCacheManager
import java.util.concurrent.TimeUnit

@Configuration
@EnableCaching
class CacheConfig {

    @Bean
    fun cacheManager(): CacheManager {
        val caffeineCacheManager = CaffeineCacheManager("geoip")
        caffeineCacheManager.setCaffeine(
            Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(1000)
        )
        return caffeineCacheManager
    }
}
