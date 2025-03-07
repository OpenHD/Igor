# ===== Stage 1: Build – Erzeugung eines nativen Images =====
FROM gradle:jdk23-graal AS builder
WORKDIR /app

# Kopiere alle relevanten Dateien (Dockerfile liegt bereits im Backend-Ordner)
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle.kts ./
COPY settings.gradle.kts ./
COPY src ./src
RUN chmod +x gradlew

# Führe den nativen Build (z. B. Task "nativeBuild") aus – passe ggf. den Tasknamen an
RUN ./gradlew clean nativeBuild -x test

# ===== Stage 2: Runtime – Minimaler Container via distroless =====
FROM gcr.io/distroless/base-debian10
WORKDIR /app

# Kopiere die erstellte native Binärdatei (Passe den Pfad ggf. an, falls Dein Build sie woanders ablegt)
COPY --from=builder /app/build/libs/app /app/app

# Exponiere den Anwendungsport
EXPOSE 8080

# Starte die Anwendung
CMD ["/app/app"]
