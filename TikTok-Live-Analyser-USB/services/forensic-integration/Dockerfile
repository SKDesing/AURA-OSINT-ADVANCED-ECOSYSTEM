FROM node:18-alpine

# Installation des dépendances système pour AXIOM
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl \
    bash

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production && npm cache clean --force

# Création des répertoires de travail
RUN mkdir -p /workspace/axiom /workspace/outrider /workspace/evidence

# Copie du code source
COPY . .

# Configuration des permissions
RUN chown -R node:node /app /workspace

# Exposition du port
EXPOSE 3000

# Utilisateur non-root pour la sécurité
USER node

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV AXIOM_WORKSPACE=/workspace/axiom
ENV EVIDENCE_PATH=/workspace/evidence

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]