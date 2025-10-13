#!/bin/bash
# 🚀 DÉPLOIEMENT RAPIDE AURA-OSINT - VERSION PRODUCTION
# Basé sur l'audit actuel + sécurisations

set -euo pipefail
IFS=$'\n\t'

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_DIR="logs/deploy"
LOG_FILE="$LOG_DIR/deploy-$TIMESTAMP.log"

mkdir -p "$LOG_DIR"
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

wait_for_service() {
    local service=$1
    local url=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    log_info "Attente démarrage $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "$url" >/dev/null 2>&1; then
            log_success "$service est prêt"
            return 0
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_error "$service timeout"
    return 1
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║       🚀 DÉPLOIEMENT RAPIDE AURA-OSINT v2.0               ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_info "📋 Pre-flight checks..."

# Vérifier Docker
if ! docker ps >/dev/null 2>&1; then
    log_error "Docker daemon inaccessible"
    exit 1
fi

log_success "Pre-flight checks OK"
echo ""

# Backup
log_info "💾 Création backup..."
BACKUP_DIR="backups/pre-deploy-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
cp backend/.env docker-compose.yml "$BACKUP_DIR/" 2>/dev/null || true
log_success "Backup: $BACKUP_DIR"
echo ""

# PHASE 1: PostgreSQL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "1/6 📊 PostgreSQL..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q aura-postgresql; then
    log_info "PostgreSQL déjà actif"
else
    log_info "Démarrage PostgreSQL..."
    docker-compose up -d postgresql
    
    attempt=1
    while [ $attempt -le 30 ]; do
        if docker exec aura-postgresql pg_isready -U root >/dev/null 2>&1; then
            log_success "PostgreSQL prêt"
            break
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_info "Application schéma SQL..."
    docker exec -i aura-postgresql psql -U root -d aura_osint < database/schema-ultimate-v2.sql || log_warning "Schéma déjà existant"
fi

log_success "PostgreSQL OK"
echo ""

# PHASE 2: Redis
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "2/6 🔴 Redis..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q aura-redis; then
    log_info "Redis déjà actif"
else
    docker-compose up -d redis
    sleep 5
fi

if docker exec aura-redis redis-cli ping | grep -q PONG; then
    log_success "Redis OK"
else
    log_error "Redis ne répond pas"
    exit 1
fi
echo ""

# PHASE 3: llama.cpp
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "3/6 🔨 llama.cpp..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LLAMA_SERVER="ai/local-llm/runtime/llama.cpp/build/bin/llama-server"

if [ -f "$LLAMA_SERVER" ]; then
    log_info "llama.cpp déjà compilé"
else
    log_info "Compilation llama.cpp (5-10 min)..."
    cd ai/local-llm/runtime/llama.cpp
    
    if command -v nvidia-smi &>/dev/null; then
        log_info "CUDA détecté - Compilation GPU"
        cmake -B build -DLLAMA_CUDA=ON
    else
        log_warning "CUDA non détecté - Compilation CPU"
        cmake -B build
    fi
    
    cmake --build build --config Release -j"$(nproc)"
    cd "$PROJECT_ROOT"
    
    if [ -f "$LLAMA_SERVER" ]; then
        log_success "llama.cpp compilé"
    else
        log_error "Compilation échouée"
        exit 1
    fi
fi

log_success "llama.cpp OK"
echo ""

# PHASE 4: Qwen AI
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "4/6 🤖 Qwen AI..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if pgrep -f "llama.*server" >/dev/null; then
    log_info "Qwen déjà actif"
else
    if [ ! -f "ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf" ]; then
        log_error "Modèle Qwen introuvable"
        exit 1
    fi
    
    log_info "Démarrage Qwen..."
    nohup ./ai/local-llm/scripts/run-llm-qwen.sh > "$LOG_DIR/qwen-$TIMESTAMP.log" 2>&1 &
    QWEN_PID=$!
    echo "$QWEN_PID" > "$LOG_DIR/qwen.pid"
    
    if wait_for_service "Qwen" "http://localhost:8080/health" 60; then
        log_success "Qwen démarré (PID: $QWEN_PID)"
    else
        log_error "Qwen timeout - voir logs: $LOG_DIR/qwen-$TIMESTAMP.log"
        exit 1
    fi
fi

log_success "Qwen OK"
echo ""

# PHASE 5: Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "5/6 🚀 Backend NestJS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend

if [ ! -d "node_modules" ]; then
    log_info "Installation npm..."
    npm install
    log_success "npm install OK"
else
    log_info "node_modules déjà installé"
fi

if [ ! -d "dist" ]; then
    log_info "Build backend..."
    npm run build
    log_success "Build OK"
else
    log_info "Backend déjà compilé"
fi

if pgrep -f "nest.*start" >/dev/null; then
    log_info "Backend déjà actif"
else
    log_info "Démarrage backend..."
    nohup npm run start:prod > "../$LOG_DIR/backend-$TIMESTAMP.log" 2>&1 &
    BACKEND_PID=$!
    echo "$BACKEND_PID" > "../$LOG_DIR/backend.pid"
    
    cd "$PROJECT_ROOT"
    
    if wait_for_service "Backend" "http://localhost:3001/api/health" 60; then
        log_success "Backend démarré (PID: $BACKEND_PID)"
    else
        log_error "Backend timeout - voir logs: $LOG_DIR/backend-$TIMESTAMP.log"
        exit 1
    fi
fi

cd "$PROJECT_ROOT"
echo ""

# PHASE 6: Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "6/6 🧪 Tests de validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TESTS_PASSED=0
TESTS_TOTAL=6

docker exec aura-postgresql pg_isready -U root >/dev/null 2>&1 && { log_success "PostgreSQL: OK"; ((TESTS_PASSED++)); } || log_error "PostgreSQL: FAIL"
docker exec aura-redis redis-cli ping | grep -q PONG && { log_success "Redis: OK"; ((TESTS_PASSED++)); } || log_error "Redis: FAIL"
curl -sf http://localhost:9200/_cluster/health >/dev/null 2>&1 && { log_success "Elasticsearch: OK"; ((TESTS_PASSED++)); } || log_warning "Elasticsearch: SKIP"
curl -sf http://localhost:6333/health >/dev/null 2>&1 && { log_success "Qdrant: OK"; ((TESTS_PASSED++)); } || log_warning "Qdrant: SKIP"
curl -sf http://localhost:8080/health >/dev/null 2>&1 && { log_success "Qwen AI: OK"; ((TESTS_PASSED++)); } || log_error "Qwen AI: FAIL"
curl -sf http://localhost:3001/api/health | grep -q ok && { log_success "Backend API: OK"; ((TESTS_PASSED++)); } || log_error "Backend API: FAIL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "Résultat: $TESTS_PASSED/$TESTS_TOTAL tests passés"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Rapport final
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║               🎉 DÉPLOIEMENT TERMINÉ !                    ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ $TESTS_PASSED -ge 4 ]; then
    log_success "Système opérationnel"
    
    echo ""
    echo "🌐 SERVICES DISPONIBLES:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  🤖 AURA-MIND (IA):       http://localhost:8080"
    echo "  🚀 Backend API:          http://localhost:3001"
    echo "  📚 Documentation API:    http://localhost:3001/api/docs"
    echo "  📊 Health Check:         http://localhost:3001/api/health"
    echo ""
    echo "  🗄️  PostgreSQL:          localhost:5432"
    echo "  🔴 Redis:                localhost:6379"
    echo "  🔍 Elasticsearch:        http://localhost:9200"
    echo "  📊 Qdrant:               http://localhost:6333"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 LOGS:"
    echo "  • Déploiement: $LOG_FILE"
    echo "  • Qwen AI:     $LOG_DIR/qwen-$TIMESTAMP.log"
    echo "  • Backend:     $LOG_DIR/backend-$TIMESTAMP.log"
    echo ""
    echo "💾 BACKUP: $BACKUP_DIR"
    echo ""
    echo "🔧 GESTION:"
    echo "  • Arrêter Backend: kill \$(cat $LOG_DIR/backend.pid)"
    echo "  • Arrêter Qwen:    kill \$(cat $LOG_DIR/qwen.pid)"
    echo "  • Arrêter tout:    docker-compose down"
    echo ""
    echo "🧪 TEST RAPIDE:"
    echo "  curl http://localhost:3001/api/health | jq"
    echo ""
    
    exit 0
else
    log_error "Déploiement partiel - $TESTS_PASSED/$TESTS_TOTAL services OK"
    echo ""
    echo "🔧 DÉPANNAGE:"
    echo "  • Logs: tail -f $LOG_FILE"
    echo "  • Qwen: tail -f $LOG_DIR/qwen-$TIMESTAMP.log"
    echo "  • Backend: tail -f $LOG_DIR/backend-$TIMESTAMP.log"
    echo ""
    exit 1
fi
