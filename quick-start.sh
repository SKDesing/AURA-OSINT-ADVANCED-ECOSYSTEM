#!/bin/bash
# AURA OSINT Quick Start - Fix Docker Compose

echo "🚀 AURA OSINT QUICK START"
echo "========================="

# Créer dossier logs manquant
mkdir -p logs

# Fix Docker Compose dans osint-tools-advanced
cd osint-tools-advanced

# Remplacer 'docker compose' par 'docker-compose'
sed -i 's/docker compose/docker-compose/g' Makefile

# Copier .env.example vers .env
cp .env.example .env

echo "🔧 Démarrage services OSINT..."
docker-compose up -d

echo "⏳ Attente initialisation (30s)..."
sleep 30

echo "✅ Services démarrés!"
echo ""
echo "📊 URLs disponibles:"
echo "  - SearXNG:     http://localhost:8080"
echo "  - Kibana:      http://localhost:5601"
echo "  - Elasticsearch: http://localhost:9200"
echo ""
echo "🧪 Tests rapides:"
echo "  make test-ner-enhanced"
echo "  make test-fetcher"