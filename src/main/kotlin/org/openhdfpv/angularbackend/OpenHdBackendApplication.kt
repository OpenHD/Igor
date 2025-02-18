package org.openhdfpv.angularbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class OpenHdBackendApplication

fun main(args: Array<String>) {
    runApplication<OpenHdBackendApplication>(*args)
}
