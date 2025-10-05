#!/bin/bash

echo "🚀 Lancement AURA avec ton Brave local"

# Démarrer les services Docker
echo "📦 Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente des services..."
sleep 10

# Lancer la capture avec ton navigateur local
echo "🌐 Lancement de la capture avec ton Brave..."
node capture-local-browser.js

echo "✅ AURA prêt !"
echo "🎯 Interface React: http://localhost:3003"
echo "📊 Backend API: http://localhost:3002"