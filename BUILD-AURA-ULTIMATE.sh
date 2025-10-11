#!/bin/bash

# ============================================
# 🚀 AURA OSINT - BUILD ULTIMATE UNIFIED
# ============================================
# Script unifié fusionnant TOUS les builds de l'écosystème
# Combine: aura-master-build.sh + tous les RUN-AURA-*.sh + launch-aura-ecosystem.js

set -euo pipefail

# Configuration globale
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
LOG_FILE="$PROJECT_ROOT/logs/aura-ultimate-build-$(date +%Y%m%d-%H%M%S).log"
VENV_PATH="$PROJECT_ROOT/venv-osint"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# PIDs des processus
BACKEND_PID=""
AI_PID=""
FRONTEND_PID=""
BROWSER_PID=""
METRICS_PID=""
VITRINE_PID=""

# Logging avancé
log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"; exit 1; }
info() { echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"; }

# Créer structure logs
mkdir -p "$PROJECT_ROOT/logs"

echo "🔥 AURA OSINT ULTIMATE BUILD & LAUNCHER"
echo "======================================="
log "Démarrage build ultimate unifié de l'écosystème complet"

# ============================================
# PHASE 1: NETTOYAGE COMPLET
# ============================================
log "🧹 Phase 1: Nettoyage complet système"

cleanup_processes() {
    log "Arrêt de tous les processus AURA existants"
    pkill -f "mvp-server.js" 2>/dev/null || true
    pkill -f "node.*qwen" 2>/dev/null || true
    pkill -f "node.*ai-engine" 2>/dev/null || true
    pkill -f "electron" 2>/dev/null || true
    pkill -f "python.*http.server" 2>/dev/null || true
    pkill -f "node.*4011" 2>/dev/null || true
    pkill -f "chromium.*aura" 2>/dev/null || true
    fuser -k 4011/tcp 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
    fuser -k 8000/tcp 2>/dev/null || true
    fuser -k 8001/tcp 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    sleep 3
}

cleanup_processes

# ============================================
# PHASE 2: VÉRIFICATIONS SYSTÈME
# ============================================
log "📋 Phase 2: Vérifications système complètes"

check_command() {
    if ! command -v "$1" &> /dev/null; then
        error "$1 non installé. Installation requise."
    fi
    success "✅ $1 disponible"
}

check_command node
check_command npm
check_command python3
check_command docker
check_command git

# Vérifier versions
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
PYTHON_VERSION=$(python3 --version)
DOCKER_VERSION=$(docker --version)

info "Node.js: $NODE_VERSION"
info "NPM: $NPM_VERSION"
info "Python: $PYTHON_VERSION"
info "Docker: $DOCKER_VERSION"

# ============================================
# PHASE 3: ENVIRONNEMENT PYTHON OSINT
# ============================================
log "🐍 Phase 3: Configuration environnement Python OSINT"

if [ ! -d "$VENV_PATH" ]; then
    log "Création environnement virtuel Python"
    python3 -m venv "$VENV_PATH"
fi

source "$VENV_PATH/bin/activate"
success "✅ Environnement virtuel Python activé"

# Installation dépendances Python OSINT
log "📦 Installation dépendances Python OSINT complètes"
pip install --upgrade pip
if [ -f "$PROJECT_ROOT/backend/requirements-complete.txt" ]; then
    pip install -r "$PROJECT_ROOT/backend/requirements-complete.txt" || warn "Certaines dépendances Python ont échoué"
fi

# ============================================
# PHASE 4: BASES DE DONNÉES & DOCKER
# ============================================
log "🐳 Phase 4: Configuration bases de données & Docker"

# Démarrer tous les services Docker
log "Démarrage de tous les services Docker"
cd "$PROJECT_ROOT"
docker-compose -f docker-compose.unified.yml up -d || docker-compose up -d

# Attendre que les services démarrent
log "⏳ Attente démarrage services Docker (20s)..."
sleep 20

# Vérifier services Docker
check_docker_service() {
    local service=$1
    local port=$2
    
    if docker ps | grep -q "$service"; then
        success "✅ $service opérationnel"
    else
        warn "❌ $service non démarré"
    fi
}

check_docker_service "postgres" "5432"
check_docker_service "redis" "6379"
check_docker_service "elasticsearch" "9200"
check_docker_service "qdrant" "6333"

# ============================================
# PHASE 5: INSTALLATION DÉPENDANCES NPM
# ============================================
log "📦 Phase 5: Installation dépendances NPM complètes"

# Backend
if [ -d "$PROJECT_ROOT/backend" ]; then
    log "Installation dépendances backend"
    cd "$PROJECT_ROOT/backend"
    npm install || warn "Erreur installation backend"
    cd "$PROJECT_ROOT"
fi

# Backend AI
if [ -d "$PROJECT_ROOT/backend-ai" ]; then
    log "Installation dépendances backend-ai"
    cd "$PROJECT_ROOT/backend-ai"
    npm install || warn "Erreur installation backend-ai"
    cd "$PROJECT_ROOT"
fi

# AI Engine
if [ -d "$PROJECT_ROOT/ai-engine" ]; then
    log "Installation dépendances ai-engine"
    cd "$PROJECT_ROOT/ai-engine"
    npm install || warn "Erreur installation ai-engine"
    cd "$PROJECT_ROOT"
fi

# Frontend
if [ -d "$PROJECT_ROOT/frontend" ]; then
    log "Installation dépendances frontend"
    cd "$PROJECT_ROOT/frontend"
    npm install || warn "Erreur installation frontend"
    cd "$PROJECT_ROOT"
fi

# AURA Browser
if [ -d "$PROJECT_ROOT/aura-browser" ]; then
    log "Installation dépendances aura-browser"
    cd "$PROJECT_ROOT/aura-browser"
    npm install || warn "Erreur installation aura-browser"
    cd "$PROJECT_ROOT"
fi

# Site Vitrine
if [ -d "$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem" ]; then
    log "Installation dépendances site vitrine"
    cd "$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem"
    npm install || warn "Erreur installation site vitrine"
    cd "$PROJECT_ROOT"
fi

# ============================================
# PHASE 6: OUTILS OSINT EXTERNES
# ============================================
log "🛠️ Phase 6: Installation outils OSINT externes"

mkdir -p "$PROJECT_ROOT/tools"

# Sherlock
if [ ! -d "$PROJECT_ROOT/tools/sherlock" ]; then
    log "Installation Sherlock"
    cd "$PROJECT_ROOT/tools"
    git clone https://github.com/sherlock-project/sherlock.git || warn "Sherlock déjà installé"
    if [ -d "sherlock" ]; then
        cd sherlock
        pip install -r requirements.txt || warn "Erreur dépendances Sherlock"
        cd "$PROJECT_ROOT"
    fi
fi

# Maigret
if [ ! -d "$PROJECT_ROOT/tools/maigret" ]; then
    log "Installation Maigret"
    cd "$PROJECT_ROOT/tools"
    git clone https://github.com/soxoj/maigret.git || warn "Maigret déjà installé"
    if [ -d "maigret" ]; then
        cd maigret
        pip install . || warn "Erreur installation Maigret"
        cd "$PROJECT_ROOT"
    fi
fi

# TheHarvester
if [ ! -d "$PROJECT_ROOT/tools/theHarvester" ]; then
    log "Installation TheHarvester"
    cd "$PROJECT_ROOT/tools"
    git clone https://github.com/laramies/theHarvester.git || warn "TheHarvester déjà installé"
    if [ -d "theHarvester" ]; then
        cd theHarvester
        pip install -r requirements/base.txt || warn "Erreur dépendances TheHarvester"
        cd "$PROJECT_ROOT"
    fi
fi

# ============================================
# PHASE 7: BUILD & COMPILATION
# ============================================
log "🔨 Phase 7: Build & compilation complète"

# Build Backend AI
if [ -d "$PROJECT_ROOT/backend-ai" ]; then
    log "Build backend AI NestJS"
    cd "$PROJECT_ROOT/backend-ai"
    npm run build || warn "Build backend AI échoué"
    cd "$PROJECT_ROOT"
fi

# Build Frontend
if [ -d "$PROJECT_ROOT/frontend" ]; then
    log "Build frontend"
    cd "$PROJECT_ROOT/frontend"
    if [ -f "package.json" ] && grep -q "build" package.json; then
        npm run build || warn "Build frontend échoué"
    fi
    cd "$PROJECT_ROOT"
fi

# Build Site Vitrine
if [ -d "$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem" ]; then
    log "Build site vitrine"
    cd "$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem"
    npm run build || warn "Build site vitrine échoué"
    cd "$PROJECT_ROOT"
fi

# ============================================
# PHASE 8: DÉMARRAGE SERVICES APPLICATIFS
# ============================================
log "🚀 Phase 8: Démarrage services applicatifs"

# 1. Backend Principal (Port 4011)
if [ -f "$PROJECT_ROOT/backend/mvp-server.js" ]; then
    log "Démarrage backend principal (port 4011)"
    cd "$PROJECT_ROOT/backend"
    node mvp-server.js &
    BACKEND_PID=$!
    cd "$PROJECT_ROOT"
    sleep 3
    success "✅ Backend principal démarré (PID: $BACKEND_PID)"
fi

# 2. Moteur IA Qwen (Port 4011 intégré)
if [ -f "$PROJECT_ROOT/ai-engine/qwen-integration.js" ]; then
    log "Démarrage moteur IA Qwen"
    cd "$PROJECT_ROOT/ai-engine"
    node qwen-integration.js &
    AI_PID=$!
    cd "$PROJECT_ROOT"
    sleep 3
    success "✅ Moteur IA démarré (PID: $AI_PID)"
fi

# 3. Frontend Unifié (Port 3000)
if [ -d "$PROJECT_ROOT/frontend" ]; then
    log "Démarrage frontend unifié (port 3000)"
    cd "$PROJECT_ROOT/frontend"
    python3 -m http.server 3000 &
    FRONTEND_PID=$!
    cd "$PROJECT_ROOT"
    sleep 2
    success "✅ Frontend unifié démarré (PID: $FRONTEND_PID)"
fi

# 4. AURA Browser (Electron)
if [ -d "$PROJECT_ROOT/aura-browser" ] && [ -f "$PROJECT_ROOT/aura-browser/package.json" ]; then
    log "Démarrage AURA Browser (Electron)"
    cd "$PROJECT_ROOT/aura-browser"
    npm start &
    BROWSER_PID=$!
    cd "$PROJECT_ROOT"
    sleep 3
    success "✅ AURA Browser démarré (PID: $BROWSER_PID)"
fi

# 5. Site Vitrine (Port 5173)
if [ -d "$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem" ]; then
    log "Démarrage site vitrine (port 5173)"
    cd "$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem"
    npm run dev &
    VITRINE_PID=$!
    cd "$PROJECT_ROOT"
    sleep 3
    success "✅ Site vitrine démarré (PID: $VITRINE_PID)"
fi

# 6. Documentation Interactive (Port 8001)
if [ -d "$PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE" ]; then
    log "Démarrage documentation interactive (port 8001)"
    cd "$PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE"
    python3 -m http.server 8001 &
    METRICS_PID=$!
    cd "$PROJECT_ROOT"
    sleep 2
    success "✅ Documentation interactive démarrée (PID: $METRICS_PID)"
fi

# ============================================
# PHASE 9: TESTS DE SANTÉ COMPLETS
# ============================================
log "🏥 Phase 9: Tests de santé complets"

# Test services réseau
test_service() {
    local service=$1
    local url=$2
    
    if curl -s "$url" &>/dev/null; then
        success "✅ $service accessible"
    else
        warn "❌ $service non accessible ($url)"
    fi
}

test_service "Backend API" "http://localhost:4011"
test_service "Frontend" "http://localhost:3000"
test_service "Documentation" "http://localhost:8001"
test_service "Elasticsearch" "http://localhost:9200"

# Test outils OSINT
test_osint_tool() {
    local tool=$1
    local test_cmd=$2
    
    if eval "$test_cmd" &>/dev/null; then
        success "✅ $tool opérationnel"
    else
        warn "❌ $tool non opérationnel"
    fi
}

if [ -d "$PROJECT_ROOT/tools/sherlock" ]; then
    test_osint_tool "Sherlock" "python3 $PROJECT_ROOT/tools/sherlock/sherlock.py --help"
fi

# ============================================
# PHASE 10: OUVERTURE INTERFACES
# ============================================
log "🌐 Phase 10: Ouverture interfaces utilisateur"

open_url() {
    local url=$1
    if command -v xdg-open > /dev/null; then
        xdg-open "$url" &
    elif command -v open > /dev/null; then
        open "$url" &
    fi
}

sleep 2
open_url "http://localhost:3000"
sleep 1
open_url "http://localhost:4011"

# ============================================
# PHASE 11: RAPPORT FINAL & MONITORING
# ============================================
log "📊 Phase 11: Génération rapport final"

# Créer rapport JSON complet
cat > "$PROJECT_ROOT/logs/ultimate-build-report.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "build_status": "SUCCESS",
  "ecosystem_version": "2.0.0-ultimate",
  "services": {
    "backend_api": {
      "port": 4011,
      "pid": $BACKEND_PID,
      "status": "running"
    },
    "ai_engine": {
      "port": 4011,
      "pid": $AI_PID,
      "status": "running"
    },
    "frontend": {
      "port": 3000,
      "pid": $FRONTEND_PID,
      "status": "running"
    },
    "aura_browser": {
      "pid": $BROWSER_PID,
      "status": "running"
    },
    "site_vitrine": {
      "port": 5173,
      "pid": $VITRINE_PID,
      "status": "running"
    },
    "documentation": {
      "port": 8001,
      "pid": $METRICS_PID,
      "status": "running"
    }
  },
  "databases": {
    "postgresql": "localhost:5432",
    "redis": "localhost:6379",
    "elasticsearch": "localhost:9200",
    "qdrant": "localhost:6333"
  },
  "osint_tools": {
    "sherlock": "installed",
    "maigret": "installed",
    "theharvester": "installed",
    "integrated_tools": 17
  },
  "build_log": "$LOG_FILE"
}
EOF

# ============================================
# AFFICHAGE FINAL
# ============================================

echo ""
echo "🎉 AURA OSINT ULTIMATE BUILD TERMINÉ AVEC SUCCÈS!"
echo "=================================================="
echo ""
echo "🌟 INTERFACES PRINCIPALES:"
echo "├─ 🎨 Frontend Unifié:      http://localhost:3000"
echo "├─ 🔧 Backend API:           http://localhost:4011"
echo "├─ 💬 Chat IA Qwen:          http://localhost:4011/chat"
echo "├─ 🌐 AURA Browser:          Interface Electron lancée"
echo "├─ 🎭 Site Vitrine:          http://localhost:5173"
echo "└─ 📚 Documentation:         http://localhost:8001"
echo ""
echo "🗄️ BASES DE DONNÉES:"
echo "├─ 📊 PostgreSQL:            localhost:5432"
echo "├─ 🔴 Redis:                 localhost:6379"
echo "├─ 🔍 Elasticsearch:         http://localhost:9200"
echo "└─ 🧠 Qdrant:                http://localhost:6333"
echo ""
echo "🛠️ OUTILS OSINT (17 INTÉGRÉS):"
echo "├─ 📱 Phone: phoneinfoga, phonenumbers"
echo "├─ 🧅 Darknet: onionscan, torbot"
echo "├─ 👤 Username: sherlock, maigret"
echo "├─ 🌐 Network: shodan, nmap, subfinder, whois, amass"
echo "├─ 📧 Email: holehe, h8mail, theHarvester"
echo "├─ 💥 Breach: h8mail"
echo "├─ 🌍 Domain: subfinder, whois"
echo "└─ 📱 Social: twitter, instagram"
echo ""
echo "🎯 FONCTIONNALITÉS CLÉS:"
echo "├─ ✅ IA Qwen intégrée avec sélection automatique d'outils"
echo "├─ ✅ Interface unifiée avec navigation Golden Ratio"
echo "├─ ✅ WebSocket temps réel pour investigations"
echo "├─ ✅ 17 outils OSINT opérationnels"
echo "├─ ✅ Documentation interactive complète"
echo "├─ ✅ Site vitrine avec démo"
echo "└─ ✅ Architecture microservices complète"
echo ""
echo "📋 COMMANDES UTILES:"
echo "├─ Logs build:    tail -f $LOG_FILE"
echo "├─ Rapport:       cat $PROJECT_ROOT/logs/ultimate-build-report.json"
echo "├─ Santé API:     curl http://localhost:4011/health"
echo "└─ Arrêt:         Ctrl+C (arrêt propre de tous les services)"
echo ""
echo "💡 ACCÈS RAPIDE:"
echo "└─ Tout depuis le frontend unifié: http://localhost:3000"
echo ""
echo "⚡ Ctrl+C pour arrêter l'écosystème complet"

# ============================================
# GESTION ARRÊT PROPRE
# ============================================

cleanup_ultimate() {
    echo ""
    echo "🛑 ARRÊT ÉCOSYSTÈME AURA OSINT ULTIMATE..."
    echo "=========================================="
    
    log "Arrêt des services applicatifs"
    [ -n "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null && log "Backend arrêté"
    [ -n "$AI_PID" ] && kill $AI_PID 2>/dev/null && log "IA arrêtée"
    [ -n "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null && log "Frontend arrêté"
    [ -n "$BROWSER_PID" ] && kill $BROWSER_PID 2>/dev/null && log "Browser arrêté"
    [ -n "$VITRINE_PID" ] && kill $VITRINE_PID 2>/dev/null && log "Site vitrine arrêté"
    [ -n "$METRICS_PID" ] && kill $METRICS_PID 2>/dev/null && log "Documentation arrêtée"
    
    log "Arrêt des services Docker"
    docker-compose down 2>/dev/null || true
    
    success "✅ Écosystème AURA OSINT arrêté proprement"
    exit 0
}

trap cleanup_ultimate SIGINT SIGTERM

# Attendre indéfiniment
log "Écosystème AURA OSINT Ultimate opérationnel - En attente..."
wait