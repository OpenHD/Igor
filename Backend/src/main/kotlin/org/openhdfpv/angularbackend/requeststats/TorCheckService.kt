package org.openhdfpv.angularbackend.requeststats

import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.client.RestTemplate
import java.util.concurrent.ConcurrentHashMap
import jakarta.annotation.PostConstruct

@Service
class TorCheckService {
    private val exitNodes = ConcurrentHashMap<String, Boolean>()
    private val logger = LoggerFactory.getLogger(javaClass)

    @PostConstruct
    @Scheduled(cron = "0 0 * * * *")
    fun refreshTorList() {
        try {
            RestTemplate().getForObject(
                "https://check.torproject.org/torbulkexitlist",
                String::class.java
            )?.lines()?.forEach { exitNodes[it] = true }
        } catch (e: Exception) {
            logger.error("Tor-List update failed", e)
        }
    }

    fun isTorExitNode(ip: String): Boolean = exitNodes.containsKey(ip)
}
