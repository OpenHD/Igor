package org.openhdfpv.angularbackend

import org.junit.jupiter.api.Test
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ActiveProfiles

@DataJpaTest
@ActiveProfiles("test")
class OpenHdBackendApplicationTests {

    @Test
    fun contextLoads() {
    }

}
