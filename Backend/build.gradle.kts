plugins {
    kotlin("jvm") version "2.1.10"
    kotlin("plugin.spring") version "2.1.10"
    kotlin("plugin.jpa") version "2.1.10"
    id("org.springframework.boot") version "3.4.2"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.netflix.dgs.codegen") version "7.0.3"
    id("org.graalvm.buildtools.native") version "0.10.4"
}

group = "org.openhdfpv"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(23)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {

    // HTMX
    implementation("org.webjars.npm:htmx.org:1.9.10")

    // Alpine.js
    implementation("org.webjars.npm:alpinejs:3.13.5")

    implementation("com.graphql-java:graphql-java-extended-scalars")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.projectlombok:lombok")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    //implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
    //implementation("com.netflix.graphql.dgs.codegen:graphql-dgs-codegen-gradle:7.0.3")
    runtimeOnly("com.h2database:h2") // oder eine andere Datenbank Ihrer Wahl
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    //implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.springframework.session:spring-session-core")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    //developmentOnly("org.springframework.boot:spring-boot-docker-compose")
    runtimeOnly("io.micrometer:micrometer-registry-prometheus")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.springframework:spring-webflux")
    testImplementation("org.springframework.graphql:spring-graphql-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
    jvmToolchain(23)
}

tasks.generateJava {
    schemaPaths.add("${projectDir}/src/main/resources/graphql-client")
    packageName = "org.openhdfpv.angularbackend.codegen"
    generateClient = true
}

tasks.withType<Test> {
    useJUnitPlatform()
}


