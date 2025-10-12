#!/bin/bash

echo "🤖 AURA OSINT - LANCEMENT AVEC IA QWEN INTÉGRÉE"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "node.*ai-engine" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true

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
echo "⏳ Initialisation des services (10s)..."
sleep 10

# Démarrer le moteur IA avec Qwen
echo "🤖 Démarrage du moteur IA avec Qwen..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

# Attendre que le moteur IA démarre
sleep 3

# Ouvrir l'interface de chat dans le navigateur
echo "🌐 Ouverture de l'interface de chat..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:4011/chat &
elif command -v open > /dev/null; then
    open http://localhost:4011/chat &
fi

# Afficher le résumé
echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT AVEC IA OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🤖 Moteur IA: http://localhost:4011"
echo "💬 Interface de chat: http://localhost:4011/chat"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo ""
echo "🎯 Utilisez l'interface de chat pour interagir avec l'IA!"
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Gérer l'arrêt propre
trap 'echo -e "\n\n🛑 Arrêt de l'\''écosystème AURA OSINT..."; kill $AI_PID 2>/dev/null; exit 0' INT

# Attendre indéfiniment
wait