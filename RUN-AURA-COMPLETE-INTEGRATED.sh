#!/bin/bash

echo "🌟 AURA OSINT - ÉCOSYSTÈME COMPLET INTÉGRÉ"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "node.*ai-engine" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true
pkill -f "python.*http.server" 2>/dev/null || true

# Vérifier et démarrer les bases de données
echo "🐳 Vérification des bases de données..."
if ! docker ps | grep -q postgres; then
    echo "Démarrage PostgreSQL..."
    docker-compose up -d postgres
fi

if ! docker ps | grep -q redis; then
    echo "Démarrage Redis..."
    docker-compose up -d redis
fi

if ! docker ps | grep -q elasticsearch; then
    echo "Démarrage Elasticsearch..."
    docker-compose up -d elasticsearch
fi

# Attendre que les services démarrent
echo "⏳ Initialisation des services (15s)..."
sleep 15

# Démarrer le moteur IA intégré
echo "🤖 Démarrage du moteur IA AURA intégré..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

# Attendre que le moteur IA démarre
sleep 5

# Ouvrir les interfaces
echo "🌐 Ouverture des interfaces AURA..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:4011 &
    sleep 2
    xdg-open http://localhost:4011/chat &
elif command -v open > /dev/null; then
    open http://localhost:4011 &
    sleep 2
    open http://localhost:4011/chat &
fi

# Afficher le résumé
echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT COMPLET OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🏠 Documentation principale: http://localhost:4011"
echo "💬 Chat IA Qwen intégré: http://localhost:4011/chat"
echo "⚙️ Configuration backend: http://localhost:4011/config"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo ""
echo "🎯 17 outils OSINT opérationnels avec IA Qwen!"
echo "🎨 SweetAlert2 avec thème Golden Ratio intégré!"
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Gérer l'arrêt propre
trap 'echo -e "\n\n🛑 Arrêt de l'\''écosystème AURA OSINT..."; kill $AI_PID 2>/dev/null; exit 0' INT

# Attendre indéfiniment
wait