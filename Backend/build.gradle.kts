plugins {
    kotlin("jvm") version "2.1.10" apply true
    kotlin("plugin.spring") version "2.1.10" apply true
    kotlin("plugin.jpa") version "2.1.10" apply true
    id("org.springframework.boot") version "3.4.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.netflix.dgs.codegen") version "8.0.2"
    id("org.graalvm.buildtools.native") version "0.10.4"
}

group = "org.openhdfpv"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // Security
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    // Database
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.postgresql:postgresql")
    runtimeOnly("com.h2database:h2")

    // GraphQL
    implementation("com.graphql-java:graphql-java-extended-scalars")

    // Web & UI
    implementation("org.webjars.npm:htmx.org:1.9.10")
    implementation("org.webjars.npm:alpinejs:3.13.5")
    implementation("nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect")

    // Utilities
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.apache.httpcomponents.client5:httpclient5")
    implementation("org.apache.httpcomponents.core5:httpcore5")
    implementation("org.springframework.retry:spring-retry")
    implementation("jakarta.annotation:jakarta.annotation-api")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")
    implementation("nl.basjes.parse.useragent:yauaa:7.30.0")
    implementation("com.bucket4j:bucket4j-core:8.1.0")
    implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")
    implementation("org.springframework.boot:spring-boot-starter-cache")

    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // Development
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    developmentOnly("org.springframework.boot:spring-boot-docker-compose")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.springframework.graphql:spring-graphql-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // Monitoring
    runtimeOnly("io.micrometer:micrometer-registry-prometheus")

    // Annotation Processing
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")

    implementation("org.springframework.boot:spring-boot-starter-actuator")
    runtimeOnly("io.micrometer:micrometer-registry-prometheus")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
    jvmToolchain(21)
}

tasks.withType<com.netflix.graphql.dgs.codegen.gradle.GenerateJavaTask> {
    schemaPaths = mutableListOf("${projectDir}/src/main/resources/graphql-client")
    packageName = "org.openhdfpv.angularbackend.codegen"
    generateClient = true
    language = "kotlin"
}

tasks.withType<Test> {
    useJUnitPlatform()
}

graalvmNative {
    binaries {
        named("main") {
            buildArgs.add("--initialize-at-build-time=org.openhdfpv")
        }
    }
}
