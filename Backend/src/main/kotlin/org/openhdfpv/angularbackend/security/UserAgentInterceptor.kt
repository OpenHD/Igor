package org.openhdfpv.angularbackend.security

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

@Component
class UserAgentInterceptor(
    private val userAgentService: UserAgentService,
    @Value("\${useragent.interceptor.enabled}") private val isEnabled: Boolean
) : HandlerInterceptor {

    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any
    ): Boolean {
        if (!isEnabled) {
            return true
        }

        val userAgent = request.getHeader("User-Agent")
        return if (userAgentService.isAllowedUserAgent(userAgent)) {
            true
        } else {
            response.status = HttpServletResponse.SC_FORBIDDEN
            false
        }
    }
}
