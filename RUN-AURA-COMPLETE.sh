#!/bin/bash

echo "🚀 AURA BROWSER - LANCEMENT ÉCOSYSTÈME COMPLET"
echo "════════════════════════════════════════════════════════════"

# Nettoyage complet
echo "🧹 Nettoyage des processus existants..."
pkill -f "mvp-server.js" 2>/dev/null
pkill -f "electron" 2>/dev/null
pkill -f "node.*4011" 2>/dev/null
fuser -k 4011/tcp 2>/dev/null
docker-compose down 2>/dev/null
sleep 2

# 1. Démarrer les services Docker
echo "🐳 Démarrage des bases de données..."
docker-compose up -d

# 2. Attendre que les services démarrent
echo "⏳ Initialisation des services (15s)..."
sleep 15

# 3. Démarrer le backend
echo "📡 Démarrage Backend AURA..."
cd backend
node mvp-server.js &
BACKEND_PID=$!
cd ..

# 4. Attendre le backend
sleep 3

# 5. Démarrer AURA Browser avec branding complet
echo "🌟 Lancement AURA Browser..."
cd aura-browser
npm start &
BROWSER_PID=$!
cd ..

echo ""
echo "✅ AURA BROWSER ÉCOSYSTÈME OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🌟 AURA Browser: Interface principale (ouverture automatique)"
echo "📡 API Backend: http://localhost:4011"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "🧠 Qdrant: http://localhost:6333"
echo ""
echo "🎯 Utilisateur ROOT: root / Phi1.618Golden!"
echo ""
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Fonction d'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt AURA Browser Écosystème..."
    kill $BACKEND_PID $BROWSER_PID 2>/dev/null
    docker-compose down
    exit 0
}

trap cleanup SIGINT SIGTERM
wait