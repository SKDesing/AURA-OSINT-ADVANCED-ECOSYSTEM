#!/bin/bash
# Script de déploiement Cloudflare Pages - AURA OSINT

set -e

echo "🚀 Déploiement AURA OSINT sur Cloudflare Pages"
echo "=============================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Exécuter depuis la racine du projet${NC}"
    exit 1
fi

# Aller dans le dossier frontend
cd clients/web/frontend

echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install

echo -e "${BLUE}🔨 Build du frontend...${NC}"
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}❌ Erreur: Le dossier build n'existe pas${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build réussi !${NC}"
echo ""
echo "📊 Taille du build:"
du -sh build/

echo ""
echo -e "${BLUE}🌐 Options de déploiement:${NC}"
echo ""
echo "1️⃣  Déploiement automatique (Git Push):"
echo "   git add ."
echo "   git commit -m 'Deploy to Cloudflare'"
echo "   git push origin main"
echo ""
echo "2️⃣  Déploiement manuel (Wrangler CLI):"
echo "   npm install -g wrangler"
echo "   wrangler login"
echo "   wrangler pages deploy build --project-name=aura-osint-frontend"
echo ""
echo "3️⃣  Test local du build:"
echo "   npx serve -s build -p 8080"
echo ""

# Demander si on veut tester localement
read -p "Voulez-vous tester le build localement ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧪 Lancement du serveur local...${NC}"
    echo "Ouvrir http://localhost:8080 dans votre navigateur"
    npx serve -s build -p 8080
fi

echo -e "${GREEN}✅ Prêt pour Cloudflare Pages !${NC}"
