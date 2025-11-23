plugins {
    kotlin("jvm") version "2.2.21" apply true
    kotlin("plugin.spring") version "2.2.21" apply true
    kotlin("plugin.jpa") version "2.2.21" apply true
    id("org.springframework.boot") version "4.0.0"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.netflix.dgs.codegen") version "8.1.1"
    id("org.graalvm.buildtools.native") version "0.11.3"
    id("org.cyclonedx.bom") version "1.10.0"
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
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")

    // Database
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.postgresql:postgresql")
    runtimeOnly("com.h2database:h2")

    // GraphQL
    implementation("com.graphql-java:graphql-java-extended-scalars")

    // Web & UI
    implementation("org.webjars.npm:htmx.org:2.0.8")
    implementation("org.webjars.npm:alpinejs:3.15.1")
    implementation("nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect")

    // Utilities
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.apache.httpcomponents.client5:httpclient5")
    implementation("org.apache.httpcomponents.core5:httpcore5")
    implementation("org.springframework.retry:spring-retry")
    implementation("jakarta.annotation:jakarta.annotation-api")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.14")
    implementation("nl.basjes.parse.useragent:yauaa:7.32.0")
    implementation("com.bucket4j:bucket4j-core:8.10.1")
    implementation("com.github.ben-manes.caffeine:caffeine:3.2.3")
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
            buildArgs.add("--initialize-at-run-time=org.openhdfpv.angularbackend.requeststats.CacheConfig\$SpringCGLIB\$0")
            buildArgs.add("--initialize-at-run-time=org.openhdfpv.angularbackend.security.SecurityConfig\$SpringCGLIB\$0")
            buildArgs.add("--initialize-at-run-time=org.openhdfpv.angularbackend.special.DummyDataLoader\$SpringCGLIB\$0")
            buildArgs.add("--initialize-at-run-time=org.openhdfpv.angularbackend.special.GraphQLConfig\$SpringCGLIB\$0")
            buildArgs.add("--initialize-at-run-time=org.openhdfpv.angularbackend.special.RestTemplateConfig\$SpringCGLIB\$0")
            buildArgs.add("--initialize-at-run-time=org.openhdfpv.angularbackend.special.UserAgentConfig\$SpringCGLIB\$0")
        }
    }
}

// SBOM generation (CycloneDX): ./gradlew cyclonedxBom
tasks.named("cyclonedxBom") {
    // Configure via extra properties if supported version
    extensions.extraProperties.set("schemaVersion", "1.5")
    extensions.extraProperties.set("projectType", "application")
    extensions.extraProperties.set("includeConfigs", listOf("runtimeClasspath", "compileClasspath"))
    extensions.extraProperties.set("skipConfigs", listOf("testRuntimeClasspath", "testCompileClasspath"))
    extensions.extraProperties.set("destination", layout.buildDirectory.dir("sbom").get().asFile.absolutePath)
    extensions.extraProperties.set("outputName", "backend-sbom")
    extensions.extraProperties.set("outputFormat", "json")
}
