#!/bin/bash

echo "🔍 AURA OSINT - Vérification Complète"
echo "===================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_tool() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 manquant${NC}"
        return 1
    fi
}

check_service() {
    if curl -s "$2" &> /dev/null; then
        echo -e "${GREEN}✅ $1 ($2)${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 ($2)${NC}"
        return 1
    fi
}

echo ""
echo "🛠️ Outils Système:"
check_tool "python3"
check_tool "pip3"
check_tool "node"
check_tool "npm"
check_tool "docker"
check_tool "git"

echo ""
echo "🔍 Outils OSINT:"
check_tool "sherlock"
check_tool "sublist3r"
check_tool "theHarvester"
check_tool "holehe"
check_tool "subfinder"
check_tool "amass"

echo ""
echo "🐳 Services Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo -e "${RED}❌ Docker non accessible${NC}"

echo ""
echo "🌐 Services Web:"
check_service "PostgreSQL" "localhost:5433"
check_service "Elasticsearch" "localhost:9200"
check_service "Kibana" "localhost:5601"
check_service "SearXNG" "localhost:8080"

echo ""
echo "📁 Structure Projet:"
[ -d "backend-ai" ] && echo -e "${GREEN}✅ backend-ai${NC}" || echo -e "${RED}❌ backend-ai${NC}"
[ -d "database" ] && echo -e "${GREEN}✅ database${NC}" || echo -e "${RED}❌ database${NC}"
[ -d "osint-tools-advanced" ] && echo -e "${GREEN}✅ osint-tools-advanced${NC}" || echo -e "${RED}❌ osint-tools-advanced${NC}"

echo ""
echo "🔐 Permissions:"
[ -w ~/.local/bin ] && echo -e "${GREEN}✅ ~/.local/bin writable${NC}" || echo -e "${RED}❌ ~/.local/bin not writable${NC}"

echo ""
echo "===================================="
echo "Vérification terminée !"
