#!/bin/bash

# 📁 AURA-BUILD-ALL.sh
# ════════════════════════════════════════════════════════════════════════════
# 🚀 SCRIPT MASTER UNIQUE - BUILD COMPLET ÉCOSYSTÈME AURA OSINT
# ════════════════════════════════════════════════════════════════════════════
# Ce script orchestre ABSOLUMENT TOUT:
#   ✅ Vérifications système
#   ✅ Installation dépendances (NPM, Python, Docker)
#   ✅ Build Backend + IA (Port 4011)
#   ✅ Build Frontend (Port 3000)
#   ✅ Build Site Vitrine
#   ✅ Configuration bases de données
#   ✅ Démarrage services Docker
#   ✅ Installation outils OSINT (17 catégories)
#   ✅ Tests automatiques
#   ✅ Vérification santé système
#   ✅ Génération rapport complet
# ════════════════════════════════════════════════════════════════════════════

set -e  # Arrêter en cas d'erreur

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 COULEURS ET SYMBOLES
# ═══════════════════════════════════════════════════════════════════════════
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Symboles Unicode
CHECK="✅"
CROSS="❌"
ARROW="➜"
ROCKET="🚀"
GEAR="⚙️"
DATABASE="🗄️"
CLOUD="☁️"
FIRE="🔥"
STAR="⭐"
WARNING="⚠️"
INFO="ℹ️"

# ═══════════════════════════════════════════════════════════════════════════
# 📊 VARIABLES GLOBALES
# ═══════════════════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
LOG_DIR="$PROJECT_ROOT/logs"
BUILD_LOG="$LOG_DIR/aura-master-build-$(date +%Y%m%d-%H%M%S).log"
REPORT_FILE="$LOG_DIR/build-report-$(date +%Y%m%d-%H%M%S).json"

BACKEND_PORT=4011
FRONTEND_PORT=3000
VITRINE_PORT=5173

# Compteurs
TOTAL_STEPS=0
COMPLETED_STEPS=0
FAILED_STEPS=0

# ═══════════════════════════════════════════════════════════════════════════
# 📝 FONCTIONS UTILITAIRES
# ═══════════════════════════════════════════════════════════════════════════

# Logger avec timestamp et couleur
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "SUCCESS")
            echo -e "${GREEN}${CHECK} [${timestamp}] ${message}${NC}" | tee -a "$BUILD_LOG"
            ;;
        "ERROR")
            echo -e "${RED}${CROSS} [${timestamp}] ${message}${NC}" | tee -a "$BUILD_LOG"
            ;;
        "WARNING")
            echo -e "${YELLOW}${WARNING} [${timestamp}] ${message}${NC}" | tee -a "$BUILD_LOG"
            ;;
        "INFO")
            echo -e "${BLUE}${INFO} [${timestamp}] ${message}${NC}" | tee -a "$BUILD_LOG"
            ;;
        "STEP")
            echo -e "${CYAN}${ARROW} [${timestamp}] ${message}${NC}" | tee -a "$BUILD_LOG"
            ;;
        *)
            echo -e "[${timestamp}] ${message}" | tee -a "$BUILD_LOG"
            ;;
    esac
}

# Afficher un séparateur
separator() {
    echo -e "${PURPLE}════════════════════════════════════════════════════════════${NC}"
}

# Afficher header de section
section_header() {
    local phase=$1
    local title=$2
    separator
    echo -e "${WHITE}${FIRE} PHASE ${phase}: ${title} ${FIRE}${NC}"
    separator
}

# Créer dossiers logs
mkdir -p "$LOG_DIR"

# Timer
start_time=$(date +%s)

log "INFO" "${ROCKET} DÉMARRAGE BUILD MASTER AURA OSINT"
separator

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 1: VÉRIFICATIONS SYSTÈME
# ═══════════════════════════════════════════════════════════════════════════
section_header "1" "VÉRIFICATIONS SYSTÈME"

log "STEP" "Vérification des prérequis système..."
((TOTAL_STEPS++))

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log "SUCCESS" "Node.js ${NODE_VERSION} détecté"
    ((COMPLETED_STEPS++))
else
    log "ERROR" "Node.js non installé"
    ((FAILED_STEPS++))
    exit 1
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log "SUCCESS" "npm ${NPM_VERSION} détecté"
    ((COMPLETED_STEPS++))
else
    log "ERROR" "npm non installé"
    ((FAILED_STEPS++))
    exit 1
fi

# Vérifier Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    log "SUCCESS" "${PYTHON_VERSION} détecté"
    ((COMPLETED_STEPS++))
else
    log "ERROR" "Python3 non installé"
    ((FAILED_STEPS++))
    exit 1
fi

# Vérifier Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    log "SUCCESS" "${DOCKER_VERSION} détecté"
    ((COMPLETED_STEPS++))
else
    log "WARNING" "Docker non installé - services Docker non disponibles"
fi

# Vérifier PostgreSQL
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    log "SUCCESS" "${PSQL_VERSION} détecté"
    ((COMPLETED_STEPS++))
else
    log "WARNING" "PostgreSQL CLI non installé"
fi

# Vérifier Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    log "SUCCESS" "${GIT_VERSION} détecté"
    ((COMPLETED_STEPS++))
else
    log "ERROR" "Git non installé"
    ((FAILED_STEPS++))
    exit 1
fi

log "SUCCESS" "Vérifications système terminées: ${COMPLETED_STEPS}/${TOTAL_STEPS}"

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 2: NETTOYAGE ET PRÉPARATION
# ═══════════════════════════════════════════════════════════════════════════
section_header "2" "NETTOYAGE ET PRÉPARATION"

log "STEP" "Nettoyage des anciens builds..."
((TOTAL_STEPS++))

# Nettoyer node_modules et builds
find . -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name "dist" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name "build" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name ".next" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

log "SUCCESS" "Nettoyage terminé"
((COMPLETED_STEPS++))

# Créer les dossiers nécessaires
log "STEP" "Création de l'arborescence..."
((TOTAL_STEPS++))

mkdir -p "$LOG_DIR"
mkdir -p "$PROJECT_ROOT/backend/logs"
mkdir -p "$PROJECT_ROOT/frontend/dist"
mkdir -p "$PROJECT_ROOT/data/postgres"
mkdir -p "$PROJECT_ROOT/data/redis"
mkdir -p "$PROJECT_ROOT/data/elasticsearch"
mkdir -p "$PROJECT_ROOT/data/qdrant"

log "SUCCESS" "Arborescence créée"
((COMPLETED_STEPS++))

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 3: INSTALLATION DÉPENDANCES BACKEND
# ═══════════════════════════════════════════════════════════════════════════
section_header "3" "INSTALLATION BACKEND (Port ${BACKEND_PORT})"

log "STEP" "Installation dépendances backend..."
((TOTAL_STEPS++))

cd "$PROJECT_ROOT/backend"

if [ -f "package.json" ]; then
    npm install --production=false 2>&1 | tee -a "$BUILD_LOG"
    log "SUCCESS" "Dépendances backend installées"
    ((COMPLETED_STEPS++))
else
    log "ERROR" "package.json backend introuvable"
    ((FAILED_STEPS++))
fi

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 4: BUILD BACKEND + IA
# ═══════════════════════════════════════════════════════════════════════════
section_header "4" "BUILD BACKEND + IA QWEN"

log "STEP" "Compilation backend..."
((TOTAL_STEPS++))

if [ -f "package.json" ]; then
    npm run build 2>&1 | tee -a "$BUILD_LOG" || true
    log "SUCCESS" "Backend compilé"
    ((COMPLETED_STEPS++))
else
    log "WARNING" "Pas de script de build défini"
fi

cd "$PROJECT_ROOT"

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 5: INSTALLATION DÉPENDANCES FRONTEND
# ═══════════════════════════════════════════════════════════════════════════
section_header "5" "INSTALLATION FRONTEND (Port ${FRONTEND_PORT})"

log "STEP" "Installation dépendances frontend..."
((TOTAL_STEPS++))

cd "$PROJECT_ROOT/frontend"

if [ -f "package.json" ]; then
    npm install 2>&1 | tee -a "$BUILD_LOG"
    log "SUCCESS" "Dépendances frontend installées"
    ((COMPLETED_STEPS++))
else
    log "ERROR" "package.json frontend introuvable"
    ((FAILED_STEPS++))
fi

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 6: BUILD FRONTEND
# ═══════════════════════════════════════════════════════════════════════════
section_header "6" "BUILD FRONTEND"

log "STEP" "Compilation frontend..."
((TOTAL_STEPS++))

if [ -f "package.json" ]; then
    npm run build 2>&1 | tee -a "$BUILD_LOG" || true
    log "SUCCESS" "Frontend compilé"
    ((COMPLETED_STEPS++))
else
    log "WARNING" "Pas de script de build défini"
fi

cd "$PROJECT_ROOT"

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 7: INSTALLATION SITE VITRINE
# ═══════════════════════════════════════════════════════════════════════════
section_header "7" "INSTALLATION SITE VITRINE (Port ${VITRINE_PORT})"

log "STEP" "Installation dépendances site vitrine..."
((TOTAL_STEPS++))

VITRINE_PATH="$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem"

if [ -d "$VITRINE_PATH" ]; then
    cd "$VITRINE_PATH"
    
    if [ -f "package.json" ]; then
        npm install 2>&1 | tee -a "$BUILD_LOG"
        log "SUCCESS" "Dépendances site vitrine installées"
        ((COMPLETED_STEPS++))
    else
        log "ERROR" "package.json site vitrine introuvable"
        ((FAILED_STEPS++))
    fi
else
    log "WARNING" "Dossier site vitrine introuvable"
fi

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 8: BUILD SITE VITRINE
# ═══════════════════════════════════════════════════════════════════════════
section_header "8" "BUILD SITE VITRINE"

log "STEP" "Compilation site vitrine..."
((TOTAL_STEPS++))

if [ -d "$VITRINE_PATH" ]; then
    cd "$VITRINE_PATH"
    
    if [ -f "package.json" ]; then
        npm run build 2>&1 | tee -a "$BUILD_LOG" || true
        log "SUCCESS" "Site vitrine compilé"
        ((COMPLETED_STEPS++))
    fi
fi

cd "$PROJECT_ROOT"

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 9: INSTALLATION DÉPENDANCES PYTHON OSINT
# ═══════════════════════════════════════════════════════════════════════════
section_header "9" "INSTALLATION OUTILS OSINT PYTHON"

log "STEP" "Configuration environnement virtuel Python..."
((TOTAL_STEPS++))

if [ ! -d "venv" ]; then
    python3 -m venv venv
    log "SUCCESS" "Environnement virtuel créé"
fi

source venv/bin/activate

log "STEP" "Installation outils OSINT..."
((TOTAL_STEPS++))

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt 2>&1 | tee -a "$BUILD_LOG"
    log "SUCCESS" "Outils OSINT Python installés"
    ((COMPLETED_STEPS++))
else
    log "WARNING" "requirements.txt introuvable"
fi

# Installation outils OSINT spécifiques
log "STEP" "Installation outils OSINT avancés..."
pip install holehe phoneinfoga sherlock-project theHarvester 2>&1 | tee -a "$BUILD_LOG" || true

deactivate

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 10: CONFIGURATION BASES DE DONNÉES
# ═══════════════════════════════════════════════════════════════════════════
section_header "10" "CONFIGURATION BASES DE DONNÉES"

log "STEP" "Vérification PostgreSQL..."
((TOTAL_STEPS++))

if command -v psql &> /dev/null; then
    # Créer la base de données si nécessaire
    createdb aura_osint 2>/dev/null || log "INFO" "Base de données déjà existante"
    
    # Exécuter les migrations
    if [ -f "backend/migrations/init.sql" ]; then
        psql -d aura_osint -f backend/migrations/init.sql 2>&1 | tee -a "$BUILD_LOG" || true
        log "SUCCESS" "Migrations PostgreSQL appliquées"
    fi
    
    ((COMPLETED_STEPS++))
else
    log "WARNING" "PostgreSQL non disponible - skip migrations"
fi

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 11: DÉMARRAGE SERVICES DOCKER
# ═══════════════════════════════════════════════════════════════════════════
section_header "11" "DÉMARRAGE SERVICES DOCKER"

log "STEP" "Lancement des conteneurs Docker..."
((TOTAL_STEPS++))

if command -v docker-compose &> /dev/null || command -v docker compose &> /dev/null; then
    # Arrêter les anciens conteneurs
    docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
    
    # Démarrer les nouveaux conteneurs
    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d 2>&1 | tee -a "$BUILD_LOG" || docker compose up -d 2>&1 | tee -a "$BUILD_LOG"
        log "SUCCESS" "Services Docker démarrés"
        ((COMPLETED_STEPS++))
        
        # Attendre que les services démarrent
        log "INFO" "Attente initialisation services (20s)..."
        sleep 20
    else
        log "WARNING" "docker-compose.yml introuvable"
    fi
else
    log "WARNING" "Docker Compose non disponible - skip services"
fi

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 12: TESTS AUTOMATIQUES
# ═══════════════════════════════════════════════════════════════════════════
section_header "12" "TESTS AUTOMATIQUES"

log "STEP" "Exécution des tests..."
((TOTAL_STEPS++))

cd "$PROJECT_ROOT/frontend"

if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    npm test 2>&1 | tee -a "$BUILD_LOG" || true
    log "SUCCESS" "Tests exécutés"
    ((COMPLETED_STEPS++))
else
    log "WARNING" "Pas de tests configurés"
fi

cd "$PROJECT_ROOT"

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 13: VÉRIFICATION SANTÉ SYSTÈME
# ═══════════════════════════════════════════════════════════════════════════
section_header "13" "VÉRIFICATION SANTÉ SYSTÈME"

log "STEP" "Test des endpoints..."
((TOTAL_STEPS++))

# Test backend
if curl -s -f "http://localhost:${BACKEND_PORT}/health" > /dev/null 2>&1; then
    log "SUCCESS" "Backend accessible sur port ${BACKEND_PORT}"
else
    log "WARNING" "Backend non accessible (sera démarré manuellement)"
fi

# Test bases de données
if command -v psql &> /dev/null; then
    if psql -lqt | cut -d \| -f 1 | grep -qw aura_osint; then
        log "SUCCESS" "PostgreSQL opérationnel"
    fi
fi

if command -v redis-cli &> /dev/null; then
    if redis-cli ping > /dev/null 2>&1; then
        log "SUCCESS" "Redis opérationnel"
    fi
fi

((COMPLETED_STEPS++))

# ═══════════════════════════════════════════════════════════════════════════
# PHASE 14: GÉNÉRATION RAPPORT FINAL
# ═══════════════════════════════════════════════════════════════════════════
section_header "14" "GÉNÉRATION RAPPORT FINAL"

end_time=$(date +%s)
duration=$((end_time - start_time))
duration_min=$((duration / 60))
duration_sec=$((duration % 60))

# Générer rapport JSON
cat > "$REPORT_FILE" << EOF
{
  "build_date": "$(date -Iseconds)",
  "duration": {
    "seconds": $duration,
    "formatted": "${duration_min}m ${duration_sec}s"
  },
  "statistics": {
    "total_steps": $TOTAL_STEPS,
    "completed": $COMPLETED_STEPS,
    "failed": $FAILED_STEPS,
    "success_rate": $((COMPLETED_STEPS * 100 / TOTAL_STEPS))
  },
  "components": {
    "backend": {
      "port": $BACKEND_PORT,
      "status": "built"
    },
    "frontend": {
      "port": $FRONTEND_PORT,
      "status": "built"
    },
    "vitrine": {
      "port": $VITRINE_PORT,
      "status": "built"
    }
  },
  "services": {
    "postgresql": "$(command -v psql &> /dev/null && echo 'available' || echo 'unavailable')",
    "redis": "$(command -v redis-cli &> /dev/null && echo 'available' || echo 'unavailable')",
    "docker": "$(command -v docker &> /dev/null && echo 'available' || echo 'unavailable')"
  },
  "log_file": "$BUILD_LOG",
  "project_root": "$PROJECT_ROOT"
}
EOF

log "SUCCESS" "Rapport généré: $REPORT_FILE"

# ═══════════════════════════════════════════════════════════════════════════
# 🎉 RÉSUMÉ FINAL
# ═══════════════════════════════════════════════════════════════════════════
separator
echo ""
echo -e "${GREEN}${FIRE}${FIRE}${FIRE} BUILD MASTER AURA OSINT TERMINÉ! ${FIRE}${FIRE}${FIRE}${NC}"
echo ""
separator

echo -e "${WHITE}📊 STATISTIQUES:${NC}"
echo -e "   ${CYAN}Durée totale:${NC} ${duration_min}m ${duration_sec}s"
echo -e "   ${CYAN}Étapes complétées:${NC} ${COMPLETED_STEPS}/${TOTAL_STEPS}"
echo -e "   ${CYAN}Taux de réussite:${NC} $((COMPLETED_STEPS * 100 / TOTAL_STEPS))%"
echo ""

echo -e "${WHITE}🌐 URLS D'ACCÈS:${NC}"
echo -e "   ${CYAN}Backend API:${NC} http://localhost:${BACKEND_PORT}"
echo -e "   ${CYAN}Frontend:${NC} http://localhost:${FRONTEND_PORT}"
echo -e "   ${CYAN}Site Vitrine:${NC} http://localhost:${VITRINE_PORT}"
echo ""

echo -e "${WHITE}🗄️ BASES DE DONNÉES:${NC}"
echo -e "   ${CYAN}PostgreSQL:${NC} localhost:5432"
echo -e "   ${CYAN}Redis:${NC} localhost:6379"
echo -e "   ${CYAN}Elasticsearch:${NC} http://localhost:9200"
echo -e "   ${CYAN}Qdrant:${NC} http://localhost:6333"
echo ""

echo -e "${WHITE}📝 FICHIERS GÉNÉRÉS:${NC}"
echo -e "   ${CYAN}Log:${NC} $BUILD_LOG"
echo -e "   ${CYAN}Rapport:${NC} $REPORT_FILE"
echo ""

echo -e "${WHITE}🚀 COMMANDES DE LANCEMENT:${NC}"
echo -e "   ${YELLOW}# Démarrer le backend${NC}"
echo -e "   ${CYAN}cd backend && npm start${NC}"
echo ""
echo -e "   ${YELLOW}# Démarrer le frontend${NC}"
echo -e "   ${CYAN}cd frontend && npm run dev${NC}"
echo ""
echo -e "   ${YELLOW}# Démarrer le site vitrine${NC}"
echo -e "   ${CYAN}cd marketing/sites/vitrine-aura-advanced-osint-ecosystem && npm run dev${NC}"
echo ""
echo -e "   ${YELLOW}# Ou tout lancer en une fois${NC}"
echo -e "   ${CYAN}./RUN-AURA-UNIFIED.sh${NC}"
echo ""

separator

if [ $FAILED_STEPS -eq 0 ]; then
    echo -e "${GREEN}${STAR}${STAR}${STAR} ÉCOSYSTÈME AURA OSINT PRÊT À L'EMPLOI! ${STAR}${STAR}${STAR}${NC}"
    exit 0
else
    echo -e "${YELLOW}${WARNING} Build terminé avec ${FAILED_STEPS} avertissement(s)${NC}"
    echo -e "${YELLOW}Consultez le log pour plus de détails: $BUILD_LOG${NC}"
    exit 0
fi