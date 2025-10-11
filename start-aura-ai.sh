#!/bin/bash
# Script de démarrage AURA AI complet

echo "🚀 DÉMARRAGE AURA AI ORCHESTRATOR"
echo "================================="

# 1. Créer dossier logs
mkdir -p logs

# 2. Démarrer le backend AI avec mock Qwen
echo "🔄 Démarrage Backend AI..."
cd backend-ai
npm run start:dev > ../logs/backend-ai.log 2>&1 &
BACKEND_PID=$!
echo "Backend AI PID: $BACKEND_PID"

# 3. Attendre que le backend démarre
sleep 10

# 4. Tester l'API
echo "🧪 Test API Backend..."
curl -X POST http://localhost:4000/api/v2/investigation/start \
  -H "Content-Type: application/json" \
  -d '{"query":"Analyser le profil TikTok @johndoe","userId":"test123"}' \
  2>/dev/null | jq . || echo "❌ API non disponible"

echo ""
echo "✅ AURA AI Orchestrator démarré!"
echo "📊 URLs disponibles:"
echo "  - Backend API:   http://localhost:4000"
echo "  - Health Check:  http://localhost:4000/api/v2/health"
echo ""
echo "📝 Logs:"
echo "  - Backend: tail -f logs/backend-ai.log"
echo ""
echo "🛑 Arrêt: kill $BACKEND_PID"