# ============================================
# Stage 1: Angular SSR Build
# ============================================
FROM node:lts AS frontend-build
WORKDIR /app/Frontend

# Copy package files and install dependencies
COPY ./Frontend/package*.json ./
RUN npm install
RUN npm ci

# Remove the node_modules directory
RUN rm -rf node_modules

# Copy the rest of the frontend files
COPY ./Frontend .

# Install Angular CLI
RUN npm install -g @angular/cli

# Generate the SSR build with Angular CLI
RUN ng build --configuration production

# ============================================
# Stage 2: Backend Build with GraalVM 22
# ============================================
FROM gradle:jdk23-graal AS backend-build
WORKDIR /app/Backend

# Copy the Gradle wrapper, Gradle configuration, and build scripts
COPY ./Backend/gradlew ./
COPY ./Backend/gradle ./gradle
COPY ./Backend/build.gradle.kts ./
COPY ./Backend/settings.gradle.kts ./
COPY ./Backend/src ./src
RUN chmod +x gradlew

#RUN microdnf install findutils
# Execute the Gradle build (without tests)
RUN ./gradlew clean build -x test

# Remove the -plain.jar file as it is not needed
RUN find . -name "*-plain.jar" -type f -delete

# ============================================
# Stage 3: Merge and Setup the Container
# ============================================
FROM gradle:jdk23-graal AS runtime
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy the built Spring Boot jar
COPY --from=backend-build /app/Backend/build/libs/*.jar app.jar

# Copy the Angular SSR builds
# "browser" contains the static files, "server" contains the Node.js SSR server
COPY --from=frontend-build /app/Frontend/dist/open-hd-management-frontend /app/Frontend

# Install Nginx (as a reverse proxy)
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy the Nginx configuration (see below)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports:
# 80: Nginx, 8080: Spring Boot, 4200: Angular 
EXPOSE 80

CMD ["/start.sh"]