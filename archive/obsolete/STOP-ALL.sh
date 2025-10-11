#!/bin/bash

echo "🛑 ARRÊT COMPLET AURA OSINT"
echo "════════════════════════════════════════════════════════════"

# Tuer tous les processus AURA
pkill -f "mvp-server.js"
pkill -f "electron"
pkill -f "node.*4011"

# Arrêter Docker
docker-compose down 2>/dev/null

# Libérer le port 4011
fuser -k 4011/tcp 2>/dev/null

echo "✅ Tous les services AURA arrêtés"