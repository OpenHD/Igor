# ===== Stage 1: Build des Angular SSR Projekts =====
FROM node:18-alpine AS builder
WORKDIR /app

# Kopiere package-Dateien (relativer Pfad, da Dockerfile im Frontend-Ordner liegt)
COPY package*.json ./
RUN npm install

# Kopiere den restlichen Quellcode
COPY . .

# Installiere Angular CLI global und erstelle den SSR Build
RUN npm install -g @angular/cli
RUN ng build --configuration production

# ===== Stage 2: Runtime =====
FROM node:18-alpine
WORKDIR /app

# Kopiere die gebauten Dateien aus dem Build-Stage
# Hier wird davon ausgegangen, dass der Build-Output im Unterordner "dist/open-hd-management-frontend" liegt
COPY --from=builder /app/dist/open-hd-management-frontend ./dist

# Exponiere den für den SSR Server genutzten Port (anpassen, falls nötig)
EXPOSE 4200

# Starte den Angular SSR Server (anpassen, falls der Entry-Point abweicht)
CMD ["node", "dist/server/server.mjs"]
