#!/bin/bash

echo "🚀 AURA OSINT - LANCEMENT OPTIMISÉ"
echo "════════════════════════════════════════════════════════════"

# Charger la configuration optimisée
if [ -f "optimized/config/.env" ]; then
    export $(cat optimized/config/.env | xargs)
    echo "✅ Configuration optimisée chargée"
fi

# Nettoyer les processus existants
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true

# Démarrer les bases de données
echo "🐳 Démarrage des bases de données..."
docker-compose up -d

# Attendre l'initialisation
echo "⏳ Initialisation (10s)..."
sleep 10

# Démarrer le moteur IA
echo "🤖 Démarrage du moteur IA..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

sleep 3

# Démarrer AURA Browser
echo "🌐 Lancement AURA Browser..."
cd aura-browser && npm start &
BROWSER_PID=$!
cd ..

echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT OPTIMISÉ OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🤖 Moteur IA: http://localhost:4011"
echo "💬 Chat IA: http://localhost:4011/chat"
echo "📚 Documentation: optimized/docs/AURA-OSINT-COMPLETE.md"
echo "⚙️ Configuration: optimized/config/"
echo ""
echo "📊 Optimisations appliquées:"
echo "   ✅ Documentation unifiée"
echo "   ✅ Configuration centralisée"
echo "   ✅ Assets optimisés (CSS/JS)"
echo ""
echo "⚡ Ctrl+C pour arrêter"

trap 'echo -e "\n🛑 Arrêt..."; kill $AI_PID $BROWSER_PID 2>/dev/null; docker-compose down; exit 0' INT
wait
