#!/bin/bash
# START-BACKEND-SIMPLE.sh - Démarrage backend sans sudo

echo "🚀 DÉMARRAGE BACKEND AURA"
echo "========================"
echo ""

cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/backend

# Update .env with password
if ! grep -q "DB_PASSWORD" .env; then
    echo "📝 Ajout DB_PASSWORD dans .env..."
    echo "DB_PASSWORD=aura2024" >> .env
    echo "✅ .env mis à jour"
else
    echo "✅ DB_PASSWORD déjà configuré"
fi

echo ""
echo "🧪 Test connexion PostgreSQL..."
PGPASSWORD=aura2024 psql -U soufiane -d aura_osint -c "SELECT 1;" &>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL OK"
else
    echo "❌ PostgreSQL - Mot de passe requis"
    echo ""
    echo "🔧 Exécute d'abord:"
    echo "   sudo -u postgres psql -c \"ALTER USER soufiane WITH PASSWORD 'aura2024';\""
    echo ""
    exit 1
fi

echo ""
echo "🚀 Démarrage backend..."
pkill -f "node server.js" 2>/dev/null
sleep 2

node server.js &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo ""
echo "⏳ Attente démarrage (10s)..."
sleep 10

# Test endpoints
echo ""
echo "🧪 Tests endpoints..."
echo ""

echo -n "  /health........... "
curl -sf http://localhost:4011/health &>/dev/null && echo "✅" || echo "❌"

echo -n "  /api/metrics...... "
curl -sf http://localhost:4011/api/metrics &>/dev/null && echo "✅" || echo "❌"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Backend démarré sur http://localhost:4011"
echo ""
echo "📋 Commandes utiles:"
echo "   • Logs: tail -f ../logs/backend-final.log"
echo "   • Stop: pkill -f 'node server.js'"
echo "   • Test: curl http://localhost:4011/health"
echo ""
