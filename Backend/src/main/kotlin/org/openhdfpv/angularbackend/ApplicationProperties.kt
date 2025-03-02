package org.openhdfpv.angularbackend

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "app")
class ApplicationProperties {
    val redirect: RedirectProperties = RedirectProperties()

    class RedirectProperties {
        var enabled: Boolean = true
    }

}
