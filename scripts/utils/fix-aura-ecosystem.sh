#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🔧 AUTO-RÉPARATION ÉCOSYSTÈME AURA OSINT               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧹 Étape 1: Nettoyage des processus..."
pkill -f "node.*server" 2>/dev/null || true
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "python.*http.server" 2>/dev/null || true
lsof -ti:4011 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo -e "${GREEN}✅ Processus nettoyés${NC}"
echo ""

echo "📦 Étape 2: Installation dépendances backend..."
if [ -d "backend" ]; then
    cd backend
    if [ ! -d "node_modules" ]; then
        npm install
        echo -e "${GREEN}✅ Dépendances backend installées${NC}"
    else
        echo -e "${YELLOW}⚠️  Dépendances backend déjà installées${NC}"
    fi
    cd ..
else
    echo "❌ Dossier backend non trouvé!"
fi
echo ""

echo "📦 Étape 3: Installation dépendances AI engine..."
if [ -d "ai-engine" ]; then
    cd ai-engine
    if [ ! -d "node_modules" ]; then
        npm install
        echo -e "${GREEN}✅ Dépendances AI engine installées${NC}"
    else
        echo -e "${YELLOW}⚠️  Dépendances AI engine déjà installées${NC}"
    fi
    cd ..
else
    echo "❌ Dossier ai-engine non trouvé!"
fi
echo ""

echo "🔑 Étape 4: Vérification permissions..."
chmod +x verify-aura-ecosystem.sh 2>/dev/null || true
chmod +x fix-aura-ecosystem.sh 2>/dev/null || true
chmod +x RUN-AURA-UNIFIED.sh 2>/dev/null || true
chmod +x optimize-complete.sh 2>/dev/null || true
echo -e "${GREEN}✅ Permissions configurées${NC}"
echo ""

echo "📝 Étape 5: Création fichiers manquants..."

# Créer .env backend s'il n'existe pas
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << 'ENV'
NODE_ENV=production
PORT=4011
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=aura_osint
POSTGRES_USER=aura
POSTGRES_PASSWORD=Phi1.618Golden!
REDIS_HOST=localhost
REDIS_PORT=6379
ENV
    echo -e "${GREEN}✅ backend/.env créé${NC}"
fi

# Créer docker-compose.yml s'il n'existe pas
if [ ! -f "docker-compose.yml" ]; then
    cat > docker-compose.yml << 'DOCKER'
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: aura_osint
      POSTGRES_USER: aura
      POSTGRES_PASSWORD: Phi1.618Golden!
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
DOCKER
    echo -e "${GREEN}✅ docker-compose.yml créé${NC}"
fi

echo ""
echo "✅ AUTO-RÉPARATION TERMINÉE!"
echo ""
echo "🔍 Lancer la vérification complète:"
echo "   ./verify-aura-ecosystem.sh"