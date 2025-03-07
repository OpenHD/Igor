#!/bin/bash
# Start the Angular SSR server (adjust the path and port if configured)
node /app/Frontend/server/server.mjs &
# Start the Spring Boot application
java -jar /app/app.jar &
# Start Nginx as a reverse proxy in the foreground
nginx -g "daemon off;"