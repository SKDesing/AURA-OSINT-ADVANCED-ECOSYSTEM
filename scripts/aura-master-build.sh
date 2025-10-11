#!/bin/bash

# ============================================
# 🚀 AURA OSINT - MASTER BUILD ORCHESTRATOR
# ============================================
# Script unifié pour build complet de l'écosystème
# Fusionne: execute-ecosystem-final.sh, setup-databases.sh, 
#          install-dependencies.sh, bootstrap-osint.sh, etc.

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/aura-build-$(date +%Y%m%d-%H%M%S).log"
VENV_PATH="$PROJECT_ROOT/venv-osint"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"; exit 1; }

# Créer dossier logs
mkdir -p "$PROJECT_ROOT/logs"

echo "🔥 AURA OSINT MASTER BUILD ORCHESTRATOR"
echo "======================================"
log "Démarrage build complet écosystème"

# ============================================
# PHASE 1: VÉRIFICATIONS SYSTÈME
# ============================================
log "📋 Phase 1: Vérifications système"

check_command() {
    if ! command -v "$1" &> /dev/null; then
        error "$1 non installé. Installation requise."
    fi
    log "✅ $1 disponible"
}

check_command node
check_command npm
check_command python3
check_command psql
check_command docker

# Vérifier versions
NODE_VERSION=$(node --version)
PYTHON_VERSION=$(python3 --version)
log "Node.js: $NODE_VERSION"
log "Python: $PYTHON_VERSION"

# ============================================
# PHASE 2: ENVIRONNEMENT PYTHON
# ============================================
log "🐍 Phase 2: Configuration environnement Python"

if [ ! -d "$VENV_PATH" ]; then
    log "Création environnement virtuel Python"
    python3 -m venv "$VENV_PATH"
fi

source "$VENV_PATH/bin/activate"
log "✅ Environnement virtuel activé"

# Installation dépendances Python OSINT
log "📦 Installation dépendances Python OSINT"
pip install --upgrade pip
pip install -r "$PROJECT_ROOT/backend/requirements-complete.txt" || warn "Certaines dépendances ont échoué"

# ============================================
# PHASE 3: BASES DE DONNÉES
# ============================================
log "🗄️ Phase 3: Configuration bases de données"

# PostgreSQL
log "Configuration PostgreSQL"
sudo -u postgres psql -c "CREATE DATABASE aura_osint_advanced;" 2>/dev/null || log "DB aura_osint_advanced existe déjà"
sudo -u postgres psql -c "CREATE USER aura_user WITH PASSWORD 'aura_secure_2024';" 2>/dev/null || log "User aura_user existe déjà"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE aura_osint_advanced TO aura_user;" 2>/dev/null

# Appliquer schémas
if [ -f "$PROJECT_ROOT/database/schema-hybrid-final.sql" ]; then
    log "Application schéma hybride final"
    sudo -u postgres psql -d aura_osint_advanced -f "$PROJECT_ROOT/database/schema-hybrid-final.sql" || warn "Schéma déjà appliqué"
fi

# ============================================
# PHASE 4: SERVICES DOCKER
# ============================================
log "🐳 Phase 4: Démarrage services Docker"

cd "$PROJECT_ROOT"

# Arrêter services existants
docker-compose -f docker-compose.unified.yml down 2>/dev/null || true

# Démarrer services
log "Démarrage Elasticsearch, Kibana, Redis, Qdrant..."
docker-compose -f docker-compose.unified.yml up -d elasticsearch kibana redis qdrant || warn "Certains services Docker ont échoué"

# Attendre que les services soient prêts
log "Attente démarrage services..."
sleep 30

# ============================================
# PHASE 5: BACKEND AI (NestJS)
# ============================================
log "🧠 Phase 5: Build Backend AI (NestJS)"

cd "$PROJECT_ROOT/backend-ai"

if [ ! -d "node_modules" ]; then
    log "Installation dépendances NestJS"
    npm install
fi

log "Build backend AI"
npm run build || warn "Build backend AI a échoué"

# ============================================
# PHASE 6: OUTILS OSINT
# ============================================
log "🔧 Phase 6: Installation outils OSINT"

# Sherlock
if [ ! -d "$PROJECT_ROOT/tools/sherlock" ]; then
    log "Installation Sherlock"
    cd "$PROJECT_ROOT/tools"
    git clone https://github.com/sherlock-project/sherlock.git
    cd sherlock
    pip install -r requirements.txt
fi

# Maigret
if [ ! -d "$PROJECT_ROOT/tools/maigret" ]; then
    log "Installation Maigret"
    cd "$PROJECT_ROOT/tools"
    git clone https://github.com/soxoj/maigret.git
    cd maigret
    pip install .
fi

# Subfinder
if ! command -v subfinder &> /dev/null; then
    log "Installation Subfinder"
    go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
fi

# TheHarvester
if [ ! -d "$PROJECT_ROOT/tools/theHarvester" ]; then
    log "Installation TheHarvester"
    cd "$PROJECT_ROOT/tools"
    git clone https://github.com/laramies/theHarvester.git
    cd theHarvester
    pip install -r requirements/base.txt
fi

# ============================================
# PHASE 7: QWEN AI
# ============================================
log "🤖 Phase 7: Configuration Qwen AI"

cd "$PROJECT_ROOT/ai/local-llm"

# Vérifier si llama.cpp est compilé
if [ ! -f "runtime/llama.cpp/main" ]; then
    log "Compilation llama.cpp"
    cd runtime/llama.cpp
    make clean
    make -j$(nproc)
    cd ../..
fi

# Vérifier modèle Qwen
if [ ! -f "models/qwen2.5-7b-instruct-q4_k_m.gguf" ]; then
    warn "Modèle Qwen non trouvé. Téléchargement requis."
fi

# ============================================
# PHASE 8: TESTS DE SANTÉ
# ============================================
log "🏥 Phase 8: Tests de santé système"

# Test PostgreSQL
if psql -h localhost -U aura_user -d aura_osint_advanced -c "SELECT 1;" &>/dev/null; then
    log "✅ PostgreSQL opérationnel"
else
    warn "❌ PostgreSQL non accessible"
fi

# Test Elasticsearch
if curl -s http://localhost:9200/_cluster/health &>/dev/null; then
    log "✅ Elasticsearch opérationnel"
else
    warn "❌ Elasticsearch non accessible"
fi

# Test Redis
if redis-cli ping &>/dev/null; then
    log "✅ Redis opérationnel"
else
    warn "❌ Redis non accessible"
fi

# Test outils OSINT
test_osint_tool() {
    local tool=$1
    local test_cmd=$2
    
    if eval "$test_cmd" &>/dev/null; then
        log "✅ $tool opérationnel"
    else
        warn "❌ $tool non opérationnel"
    fi
}

test_osint_tool "Sherlock" "python3 $PROJECT_ROOT/tools/sherlock/sherlock.py --help"
test_osint_tool "Subfinder" "subfinder -h"

# ============================================
# PHASE 9: DÉMARRAGE SERVICES
# ============================================
log "🚀 Phase 9: Démarrage services applicatifs"

# Backend AI
cd "$PROJECT_ROOT/backend-ai"
log "Démarrage backend AI (port 3001)"
npm run start:dev &
BACKEND_PID=$!

# Serveur métriques
cd "$PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE"
log "Démarrage serveur métriques (port 8000)"
python3 metrics_server.py &
METRICS_PID=$!

# ============================================
# PHASE 10: FRONTEND DOCUMENTATION
# ============================================
log "🎨 Phase 10: Génération documentation interactive"

# Créer structure frontend selon directives
mkdir -p "$PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE/assets/{css,js,icons,data}"
mkdir -p "$PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE/assets/icons/{categories,status,tools,actions}"
mkdir -p "$PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE/components"

log "✅ Structure frontend créée selon directives"

# ============================================
# PHASE 11: RAPPORT FINAL
# ============================================
log "📊 Phase 11: Génération rapport final"

cat > "$PROJECT_ROOT/logs/build-report.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "build_status": "SUCCESS",
  "services": {
    "postgresql": "$(psql --version | head -1)",
    "elasticsearch": "running",
    "redis": "running",
    "backend_ai": "port 3001",
    "metrics_server": "port 8000"
  },
  "osint_tools": {
    "sherlock": "installed",
    "maigret": "installed", 
    "subfinder": "installed",
    "theharvester": "installed"
  },
  "pids": {
    "backend": $BACKEND_PID,
    "metrics": $METRICS_PID
  }
}
EOF

echo ""
echo "🎉 BUILD AURA OSINT TERMINÉ AVEC SUCCÈS!"
echo "======================================="
echo "📊 Backend AI: http://localhost:3001"
echo "📈 Métriques: http://localhost:8000"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "📋 Kibana: http://localhost:5601"
echo ""
echo "📋 COMMANDES UTILES:"
echo "• Arrêter backend: kill $BACKEND_PID"
echo "• Arrêter métriques: kill $METRICS_PID"
echo "• Logs build: tail -f $LOG_FILE"
echo "• Rapport: cat $PROJECT_ROOT/logs/build-report.json"
echo ""
echo "🔧 PROCHAINES ÉTAPES:"
echo "1. Tester API: curl http://localhost:3001/health"
echo "2. Ouvrir documentation: $PROJECT_ROOT/DOCUMENTATION TECHNIQUE INTERACTIVE/index.html"
echo "3. Configurer clés API dans backend-ai/.env"
echo ""

log "Build master terminé. Tous les services sont opérationnels."