package org.openhdfpv.angularbackend.special

import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.CachingConfigurerSupport
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableCaching
class CacheConfig : CachingConfigurerSupport() {
    @Bean
    override fun cacheManager(): CacheManager {
        return ConcurrentMapCacheManager("geoip")
    }
}
