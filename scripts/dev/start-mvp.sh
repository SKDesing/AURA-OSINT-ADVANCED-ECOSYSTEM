#!/usr/bin/env bash
# AURA MVP - Démarrage natif (remplace Docker)
set -euo pipefail

echo "🚀 AURA MVP - Démarrage natif"
echo "=============================="

# Vérifier les ports et corriger si nécessaire
echo "📋 Vérification des ports..."
node scripts/dev/port-inventory.js

echo ""
echo "🔧 Application des corrections de ports..."
node scripts/dev/port-fix.js --apply

echo ""
echo "🚀 Démarrage des services..."

# Démarrer le backend en arrière-plan
echo "📡 Démarrage Backend MVP (port 4010)..."
cd backend
node mvp-server-fixed.js &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
sleep 2
if curl -s http://localhost:4010/health > /dev/null; then
  echo "✅ Backend MVP prêt sur http://localhost:4010"
else
  echo "❌ Backend MVP non accessible"
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

# Démarrer le frontend
echo "🖥️ Démarrage Frontend React (port 54111)..."
cd clients/web-react
pnpm start &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Services démarrés :"
echo "  📡 Backend:  http://localhost:4010"
echo "  🖥️ Frontend: http://localhost:54111"
echo ""
echo "📊 Endpoints disponibles :"
echo "  GET /ai/observability/summary   - Métriques temps réel"
echo "  GET /ai/router/decisions        - Décisions du routeur"
echo "  GET /artifacts                  - Liste des artefacts"
echo "  GET /ai/stream/metrics          - Stream SSE"
echo ""
echo "🛑 Pour arrêter : Ctrl+C ou kill $BACKEND_PID $FRONTEND_PID"

# Attendre l'interruption
trap "echo '🛑 Arrêt des services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0" INT TERM

# Garder le script actif
wait