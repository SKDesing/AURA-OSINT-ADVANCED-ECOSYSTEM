# Multi-stage build pour optimiser la taille
FROM node:18-alpine AS base

# Installer les dépendances système nécessaires
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    postgresql-client

# Variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copier les package.json
COPY package*.json ./
COPY live-tracker/package*.json ./live-tracker/
COPY frontend-react/package*.json ./frontend-react/

# Stage pour le backend
FROM base AS backend
WORKDIR /app/live-tracker
COPY live-tracker/ .
RUN npm ci --only=production

# Stage pour le frontend
FROM base AS frontend-build
WORKDIR /app/frontend-react
COPY frontend-react/ .
RUN npm ci && npm run build

# Stage final
FROM base AS production
WORKDIR /app

# Copier les fichiers de configuration
COPY config.js ./
COPY app-launcher.js ./

# Copier le backend
COPY --from=backend /app/live-tracker ./live-tracker

# Copier le frontend buildé
COPY --from=frontend-build /app/frontend-react/build ./frontend-react/build

# Créer les dossiers nécessaires
RUN mkdir -p evidence/{profiles,screenshots,raw,reports} logs

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000 4000

# Script de démarrage
CMD ["node", "app-launcher.js"]