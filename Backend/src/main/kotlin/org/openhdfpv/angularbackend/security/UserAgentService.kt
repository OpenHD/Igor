package org.openhdfpv.angularbackend.security

import nl.basjes.parse.useragent.UserAgentAnalyzer
import org.springframework.stereotype.Service

@Service
class UserAgentService(private val userAgentAnalyzer: UserAgentAnalyzer) {

    fun isAllowedUserAgent(userAgentString: String?): Boolean {
        if (userAgentString.isNullOrBlank()) {
            return false
        }

        val userAgent = userAgentAnalyzer.parse(userAgentString)
        val deviceClass = userAgent.getValue("DeviceClass")

        return deviceClass in listOf("Desktop", "Laptop", "Tablet", "Phone") ||
                "rpi-imager" in userAgentString
    }
}
