# ===== Stage 1: Build des Angular SSR Projekts =====
FROM node:20-alpine AS builder
WORKDIR /app

# Installiere pnpm global
RUN npm install -g pnpm

# Build-Metadaten (können als Build-Args gesetzt werden)
ARG FRONTEND_BUILD_TIME
ARG FRONTEND_COMMIT
ARG BACKEND_BUILD_TIME
ARG BACKEND_COMMIT

ENV FRONTEND_BUILD_TIME=${FRONTEND_BUILD_TIME}
ENV FRONTEND_COMMIT=${FRONTEND_COMMIT}
ENV BACKEND_BUILD_TIME=${BACKEND_BUILD_TIME}
ENV BACKEND_COMMIT=${BACKEND_COMMIT}

# Kopiere package-Dateien (pnpm verwendet pnpm-lock.yaml)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Kopiere den restlichen Quellcode
COPY . .

# Erstelle den Angular Build mit SSR
RUN pnpm run build

# ===== Stage 2: Runtime =====
FROM node:20-alpine
WORKDIR /app

# Installiere pnpm für das Runtime Image
RUN npm install -g pnpm

# Kopiere package.json und pnpm-lock.yaml für Produktions-Dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Installiere nur Produktions-Dependencies
RUN pnpm install --frozen-lockfile --prod

# Kopiere die gebauten Dateien aus dem Build-Stage
COPY --from=builder /app/dist/open-hd-management-frontend ./dist

# Exponiere den für den SSR Server genutzten Port (anpassen, falls nötig)
EXPOSE 4200

# Starte den Angular SSR Server (anpassen, falls der Entry-Point abweicht)
CMD ["node", "dist/server/server.mjs"]
