package org.openhdfpv.angularbackend.requeststats

import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.Cacheable
import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Retryable
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class FreeGeoIPService(
    private val restTemplate: RestTemplate
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Cacheable("geoip", unless = "#result == null")
    @Retryable(
        maxAttempts = 3,
        backoff = Backoff(delay = 1000),
        exclude = [IllegalArgumentException::class]
    )
    fun getGeoInfo(ip: String): IpIntelligence {
        return try {
            val response = restTemplate.getForObject(
                "http://ip-api.com/json/$ip?fields=66842623",
                Map::class.java
            ) as Map<String, Any>

            IpIntelligence(
                country = response["country"] as? String,
                countryCode = response["countryCode"] as? String,
                region = response["region"] as? String,
                city = response["city"] as? String,
                lat = (response["lat"] as? Double),
                lon = (response["lon"] as? Double),
                isp = response["isp"] as? String,
                asn = response["as"] as? String,
                mobile = response["mobile"] as? Boolean ?: false,
                proxy = response["proxy"] as? Boolean ?: false,
                hosting = response["hosting"] as? Boolean ?: false
            )
        } catch (e: Exception) {
            logger.warn("GeoIP lookup failed for $ip: ${e.message}")
            IpIntelligence() // Fallback
        }
    }
}

// Data class für die Antwort
data class IpIntelligence(
    val country: String? = null,
    val countryCode: String? = null,
    val region: String? = null,
    val city: String? = null,
    val lat: Double? = null,
    val lon: Double? = null,
    val isp: String? = null,
    val asn: String? = null,
    val mobile: Boolean = false,
    val proxy: Boolean = false,
    val hosting: Boolean = false
)
