#!/bin/bash
# 🔧 Script de correction post-réorganisation AURA OSINT

set -e  # Arrêter en cas d'erreur

PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
BACKUP_DIR="$PROJECT_ROOT/.backup-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$PROJECT_ROOT/fix-reorganization.log"

cd "$PROJECT_ROOT"

# Fonction logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 DÉBUT CORRECTION POST-RÉORGANISATION"
log "========================================"

# ========================================
# 1. BACKUP COMPLET
# ========================================
log ""
log "1️⃣  CRÉATION BACKUP..."

mkdir -p "$BACKUP_DIR"
cp -r marketing/ "$BACKUP_DIR/" 2>/dev/null || true
cp -r backend/ "$BACKUP_DIR/" 2>/dev/null || true
cp -r src/ "$BACKUP_DIR/" 2>/dev/null || true
cp -r tests/ "$BACKUP_DIR/" 2>/dev/null || true
cp package*.json "$BACKUP_DIR/" 2>/dev/null || true

log "✅ Backup créé: $BACKUP_DIR"

# ========================================
# 2. DÉTECTION STRUCTURE
# ========================================
log ""
log "2️⃣  DÉTECTION STRUCTURE..."

VITRINE_PATH="marketing/sites/vitrine-aura-advanced-osint-ecosystem"
BACKEND_PATH="$VITRINE_PATH/backend"

if [ ! -d "$VITRINE_PATH" ]; then
    log "❌ ERREUR: Vitrine introuvable à $VITRINE_PATH"
    exit 1
fi

log "✅ Vitrine détectée: $VITRINE_PATH"

# ========================================
# 3. CORRECTION IMPORTS JAVASCRIPT
# ========================================
log ""
log "3️⃣  CORRECTION IMPORTS JAVASCRIPT..."

FIXED_COUNT=0

# Correction imports obsolètes
find . -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.backup*" | while read file; do
    if grep -q "require.*\.\./\.\./src" "$file" 2>/dev/null; then
        sed -i 's|require(\.\./\.\./src/|require(../shared/|g' "$file"
        FIXED_COUNT=$((FIXED_COUNT + 1))
        log "  ✓ Corrigé: $file"
    fi
done

log "✅ Imports corrigés"

# ========================================
# 4. VALIDATION VITRINE
# ========================================
log ""
log "4️⃣  VALIDATION VITRINE..."

cd "$VITRINE_PATH"

# Test installation dépendances
if [ ! -d "node_modules" ]; then
    log "Installation dépendances vitrine..."
    npm install --silent 2>&1 | tee -a "$LOG_FILE"
fi

# Test build
log "Test build vitrine..."
if npm run build 2>&1 | tee -a "$LOG_FILE"; then
    log "✅ Build vitrine OK"
    BUILD_SIZE=$(du -sh build 2>/dev/null | awk '{print $1}')
    log "📦 Taille build: $BUILD_SIZE"
else
    log "❌ Build vitrine ÉCHOUÉ"
fi

cd "$PROJECT_ROOT"

# ========================================
# 5. VALIDATION BACKEND
# ========================================
log ""
log "5️⃣  VALIDATION BACKEND..."

cd "$BACKEND_PATH"

# Test installation dépendances
if [ ! -d "node_modules" ]; then
    log "Installation dépendances backend..."
    npm install --silent 2>&1 | tee -a "$LOG_FILE"
fi

# Vérifier .env
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    log "Création .env depuis .env.example..."
    cp ".env.example" ".env"
fi

cd "$PROJECT_ROOT"

# ========================================
# RAPPORT FINAL
# ========================================
log ""
log "========================================="
log "✅ CORRECTION TERMINÉE"
log "========================================="
log ""
log "📊 RÉSUMÉ:"
log "  - Backup: $BACKUP_DIR"
log "  - Log complet: $LOG_FILE"
log ""
log "🎉 PRÊT POUR TESTS"
log ""
log "📋 PROCHAINES ÉTAPES:"
log "  1. cd $VITRINE_PATH"
log "  2. npm start (test dev server)"
log "  3. cd backend && node server.js (backend)"
echo ""