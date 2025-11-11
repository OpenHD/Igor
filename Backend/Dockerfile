# ===== Stage 1: Build – Erzeugung des Spring Boot Jars =====
FROM gradle:jdk21-graal AS builder
WORKDIR /app

# Kopiere die notwendigen Dateien (Dockerfile liegt bereits im Backend-Ordner)
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle.kts ./
COPY settings.gradle.kts ./
COPY src ./src
RUN chmod +x gradlew

# Führe den Gradle Build (ohne Tests) aus
RUN ./gradlew clean build -x test

# Entferne nicht benötigte Jar-Dateien, falls erforderlich
RUN find . -name "*-plain.jar" -type f -delete

# ===== Stage 2: Runtime – Minimaler JRE Container =====
FROM eclipse-temurin:21-jre

WORKDIR /app

# Kopiere das erstellte Jar in den Runtime-Container
COPY --from=builder /app/build/libs/*.jar app.jar

# Exponiere den Anwendungsport
EXPOSE 8080

# Starte die Anwendung
CMD ["java", "-jar", "app.jar"]
