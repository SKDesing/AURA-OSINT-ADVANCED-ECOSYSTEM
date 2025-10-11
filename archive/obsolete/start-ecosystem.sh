#!/bin/bash

echo "🚀 DÉMARRAGE ÉCOSYSTÈME AURA OSINT COMPLET"
echo "════════════════════════════════════════════════════════════"

# 1. Démarrer les services Docker
echo "🐳 Démarrage des services Docker..."
docker-compose up -d

# Attendre que les services démarrent
echo "⏳ Attente du démarrage des services (30s)..."
sleep 30

# 2. Démarrer le backend
echo "📡 Démarrage du backend..."
cd backend && node mvp-server.js &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 5

# 3. Démarrer AURA Browser
echo "🌐 Démarrage AURA Browser..."
cd ../aura-browser && npm start &
BROWSER_PID=$!

echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT DÉMARRÉ!"
echo "════════════════════════════════════════════════════════════"
echo "📊 Backend: http://localhost:4011"
echo "🗄️  PostgreSQL: localhost:5432 (root/Phi1.618Golden!)"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "🧠 Qdrant: http://localhost:6333"
echo "🌐 AURA Browser: Application Electron"
echo ""
echo "⚡ Pour arrêter: Ctrl+C puis 'docker-compose down'"

# Fonction d'arrêt propre
cleanup() {
    echo ""
    echo "🛑 Arrêt de l'écosystème..."
    kill $BACKEND_PID 2>/dev/null
    kill $BROWSER_PID 2>/dev/null
    docker-compose down
    exit 0
}

trap cleanup SIGINT SIGTERM

# Garder le script actif
wait