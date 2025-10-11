#!/bin/bash

echo "🚀 AURA OSINT - LANCEMENT SIMPLE"
echo "════════════════════════════════════════════════════════════"

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "node.*server" 2>/dev/null || true
pkill -f "python.*http.server" 2>/dev/null || true

# Démarrer uniquement le backend
echo "🔧 Démarrage du backend..."
if [ -f "backend/server.js" ]; then
    cd backend && node server.js &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend démarré (PID: $BACKEND_PID)"
elif [ -f "backend/mvp-server.js" ]; then
    cd backend && node mvp-server.js &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend MVP démarré (PID: $BACKEND_PID)"
else
    echo "❌ Aucun serveur backend trouvé!"
    exit 1
fi

sleep 3

# Tester la connectivité
echo "🔍 Test de connectivité..."
if curl -s http://localhost:4011/api/health >/dev/null 2>&1; then
    echo "✅ Backend API répond sur le port 4011"
else
    echo "⚠️  Backend API ne répond pas encore"
fi

echo ""
echo "✅ AURA OSINT BACKEND OPÉRATIONNEL!"
echo "════════════════════════════════════════════════════════════"
echo "🔧 Backend API: http://localhost:4011"
echo "📊 Health Check: http://localhost:4011/api/health"
echo ""
echo "💡 Pour accéder à l'interface:"
echo "   - Ouvrez votre navigateur sur http://localhost:4011"
echo "   - Ou utilisez les endpoints API directement"
echo ""
echo "⚡ Ctrl+C pour arrêter le backend"

# Gérer l'arrêt propre
trap 'echo -e "\n🛑 Arrêt du backend..."; kill $BACKEND_PID 2>/dev/null; exit 0' INT

# Attendre
wait