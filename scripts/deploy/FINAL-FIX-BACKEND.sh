#!/bin/bash
# FINAL-FIX-COMPLETE.sh - Fix PostgreSQL + Backend

echo "🔧 FIX FINAL POSTGRESQL + BACKEND"
echo "=================================="
echo ""

# 1️⃣ PostgreSQL Configuration
echo "📊 1/3 Configuration PostgreSQL..."
sudo -u postgres psql << 'SQL'
-- Create/Update user with password
ALTER USER soufiane WITH PASSWORD 'aura2024';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE aura_osint TO soufiane;

-- Verify
\du soufiane
SQL

echo "✅ PostgreSQL user configured"
echo ""

# 2️⃣ Update backend .env
echo "📝 2/3 Mise à jour .env..."
cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/backend

cat > .env << 'ENV_EOF'
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aura_osint
DB_USER=soufiane
DB_PASSWORD=aura2024

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Qwen AI
QWEN_API_URL=http://localhost:8080
QWEN_MODEL=qwen2-7b-instruct

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Qdrant
QDRANT_URL=http://localhost:6333

# JWT
JWT_SECRET=aura-osint-secret-2024-secure

# Server
PORT=4011
NODE_ENV=production
LOG_LEVEL=info

# OSINT Tools
SHERLOCK_PATH=/usr/local/bin/sherlock
THEHARVEST_PATH=/usr/bin/theHarvester
PHONEINFOGA_URL=http://localhost:5000
ENV_EOF

echo "✅ .env configured"
echo ""

# 3️⃣ Test PostgreSQL connection
echo "🧪 3/4 Test connexion PostgreSQL..."
PGPASSWORD=aura2024 psql -U soufiane -d aura_osint -c "SELECT version();" && echo "✅ PostgreSQL OK" || {
    echo "❌ PostgreSQL connection failed"
    exit 1
}
echo ""

# 4️⃣ Start Backend
echo "🚀 4/4 Démarrage backend..."
pkill -f "node server.js" 2>/dev/null
sleep 2

mkdir -p /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/logs
node server.js > /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/logs/backend-final.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

echo "⏳ Attente démarrage (15s)..."
sleep 15

# Test endpoints
echo ""
echo "🧪 Tests endpoints..."
echo ""

echo -n "  /health........... "
curl -sf http://localhost:4011/health &>/dev/null && echo "✅" || echo "❌"

echo -n "  /api/metrics...... "
curl -sf http://localhost:4011/api/metrics &>/dev/null && echo "✅" || echo "❌"

echo -n "  /api/osint........ "
curl -sf -X POST http://localhost:4011/api/osint/investigate \
  -H "Content-Type: application/json" \
  -d '{"target":"test","type":"username"}' &>/dev/null && echo "✅" || echo "❌"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final verification
echo "📊 VÉRIFICATION COMPLÈTE:"
echo ""

SERVICES=0
TOTAL=7

check_service() {
    local name=$1
    local cmd=$2
    echo -n "  $name... "
    if eval "$cmd" &>/dev/null; then
        echo "✅"
        ((SERVICES++))
        return 0
    else
        echo "❌"
        return 1
    fi
}

check_service "Redis          " "redis-cli ping"
check_service "PostgreSQL     " "PGPASSWORD=aura2024 psql -U soufiane -d aura_osint -c 'SELECT 1'"
check_service "Elasticsearch  " "curl -sf http://localhost:9200"
check_service "Qdrant         " "curl -sf http://localhost:6333"
check_service "Qwen AI        " "curl -sf http://localhost:8080/health"
check_service "Backend        " "curl -sf http://localhost:4011/health"
check_service "Backend API    " "curl -sf http://localhost:4011/api/metrics"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PERCENT=$((SERVICES * 100 / TOTAL))

if [ $SERVICES -eq $TOTAL ]; then
    echo "🎉 DÉPLOIEMENT COMPLET: $SERVICES/$TOTAL services ($PERCENT%) ✅"
    echo ""
    echo "🚀 AURA-OSINT EST OPÉRATIONNEL !"
    echo ""
    echo "📝 URLs importantes:"
    echo "  • Qwen AI:    http://localhost:8080"
    echo "  • Backend:    http://localhost:4011"
    echo "  • Metrics:    http://localhost:4011/api/metrics"
    echo "  • Health:     http://localhost:4011/health"
    echo ""
    echo "🎯 Prochaines étapes:"
    echo "  1. cd frontend && npm install && npm run dev"
    echo "  2. Test interface: http://localhost:3000"
    echo "  3. Test investigation OSINT"
    echo ""
else
    echo "⚠️  DÉPLOIEMENT PARTIEL: $SERVICES/$TOTAL services ($PERCENT%)"
    echo ""
    echo "📋 Services manquants - Vérifier les logs:"
    echo "  tail -50 /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM/logs/backend-final.log"
    echo ""
fi
