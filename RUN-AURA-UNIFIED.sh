#!/bin/bash

echo "🚀 AURA OSINT - LANCEMENT UNIFIÉ FRONTEND/BACKEND"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*qwen" 2>/dev/null || true
pkill -f "node.*ai-engine" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true
pkill -f "python.*http.server" 2>/dev/null || true

# Démarrer les bases de données avec Docker
echo "🐳 Démarrage des bases de données..."
docker-compose up -d

# Attendre que les bases de données démarrent
echo "⏳ Initialisation des services (10s)..."
sleep 10

# Démarrer le backend optimisé (APIs uniquement)
echo "🔧 Démarrage du backend optimisé (APIs uniquement)..."
cd backend && node server.js &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
sleep 3

# Démarrer le moteur IA
echo "🤖 Démarrage du moteur IA Qwen..."
cd ai-engine && node qwen-integration.js &
AI_PID=$!
cd ..

sleep 2

# Démarrer le frontend unifié
echo "🌐 Lancement du frontend unifié..."
cd frontend && python3 -m http.server 3000 &
FRONTEND_PID=$!
cd ..

# Afficher le résumé
echo ""
echo "✅ ÉCOSYSTÈME AURA OSINT UNIFIÉ OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🌐 Frontend Unifié: http://localhost:3000"
echo "🔧 Backend API: http://localhost:4011"
echo "💬 Chat IA: http://localhost:3000 (Navigation: Chat IA)"
echo "🛠️ Outils OSINT: http://localhost:3000 (Navigation: Outils OSINT)"
echo "⚙️ Configuration: http://localhost:3000 (Navigation: Configuration)"
echo "📚 Documentation: http://localhost:3000 (Navigation: Documentation)"
echo ""
echo "🗄️ Services Backend:"
echo "   📊 PostgreSQL: localhost:5432"
echo "   🔴 Redis: localhost:6379"
echo "   🔍 Elasticsearch: localhost:9200"
echo "   🧠 Qdrant: localhost:6333"
echo ""
echo "🎯 Architecture Unifiée:"
echo "   ✅ Frontend complet avec tous les composants"
echo "   ✅ Backend optimisé pour les APIs uniquement"
echo "   ✅ Navigation unifiée entre toutes les fonctionnalités"
echo "   ✅ Design Golden Ratio (Φ = 1.618)"
echo "   ✅ Port unifié 4011 pour toutes les APIs"
echo ""
echo "💡 Accédez à tout depuis: http://localhost:3000"
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# Gérer l'arrêt propre
trap 'echo -e "\n\n🛑 Arrêt de l\\écosystème AURA OSINT..."; kill $BACKEND_PID $AI_PID $FRONTEND_PID 2>/dev/null; docker-compose down; exit 0' INT

# Attendre indéfiniment
wait