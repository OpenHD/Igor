package org.openhdfpv.angularbackend.requeststats

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime


@Service
class IpCheckScheduler(
    private val requestRepository: RequestRepository,
    private val torCheckService: TorCheckService,
    private val geoIPService: FreeGeoIPService
) {
    @Scheduled(fixedDelay = 30000)
    fun updateIpData() {
        requestRepository.findByLastCheckedAtIsNull()
            .chunked(50) // Batch-Verarbeitung
            .forEach { batch ->
                batch.forEach { request ->
                    val geoData = geoIPService.getGeoInfo(request.clientIp)
                    val isTor = torCheckService.isTorExitNode(request.clientIp)

                    request.apply {
                        country = geoData.country
                        countryCode = geoData.countryCode
                        city = geoData.city
                        lat = geoData.lat
                        lon = geoData.lon
                        isp = geoData.isp
                        asn = geoData.asn
                        isTorExitNode = isTor
                        lastCheckedAt = LocalDateTime.now()
                    }
                }
                requestRepository.saveAll(batch)
            }
    }
}
