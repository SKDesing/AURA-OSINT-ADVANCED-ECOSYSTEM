#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🔍 VÉRIFICATION COMPLÈTE ÉCOSYSTÈME AURA OSINT          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNING=0

# Fonction de test
test_component() {
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    local name="$1"
    local command="$2"
    
    echo -n "🔍 Test: $name ... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSÉ${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ ÉCHOUÉ${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "═══════════════════════════════════════════════════════════"
echo "📦 VÉRIFICATION DES DÉPENDANCES SYSTÈME"
echo "═══════════════════════════════════════════════════════════"
echo ""

test_component "Node.js installé" "command -v node"
test_component "npm installé" "command -v npm"
test_component "Python3 installé" "command -v python3"
test_component "Docker installé" "command -v docker"
test_component "Git installé" "command -v git"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📁 VÉRIFICATION STRUCTURE DES DOSSIERS"
echo "═══════════════════════════════════════════════════════════"
echo ""

test_component "Dossier backend" "test -d backend"
test_component "Dossier frontend" "test -d frontend"
test_component "Dossier ai-engine" "test -d ai-engine"
test_component "Dossier optimized" "test -d optimized"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📄 VÉRIFICATION FICHIERS CLÉS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Backend
test_component "Backend server.js" "test -f backend/server.js"
test_component "Backend package.json" "test -f backend/package.json"

# Frontend
test_component "Frontend index.html" "test -f frontend/index.html"
test_component "Frontend dashboard.js" "test -f frontend/components/dashboard.js"
test_component "Frontend config.js" "test -f frontend/components/config.js"

# AI Engine
test_component "AI Engine qwen-integration.js" "test -f ai-engine/qwen-integration.js"
test_component "AI Engine package.json" "test -f ai-engine/package.json"

# Scripts
test_component "Script RUN-AURA-UNIFIED.sh" "test -f RUN-AURA-UNIFIED.sh"
test_component "Script optimize-complete.sh" "test -f optimize-complete.sh"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🔌 VÉRIFICATION DES PORTS DISPONIBLES"
echo "═══════════════════════════════════════════════════════════"
echo ""

check_port() {
    local port=$1
    local name=$2
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  Port $port ($name) - OCCUPÉ${NC}"
        TESTS_WARNING=$((TESTS_WARNING + 1))
        echo "   └─ PID: $(lsof -ti:$port)"
    else
        echo -e "${GREEN}✅ Port $port ($name) - LIBRE${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
}

check_port 4011 "Backend API"
check_port 3000 "Frontend"
check_port 5432 "PostgreSQL"
check_port 6379 "Redis"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🧪 TESTS SYNTAXE JAVASCRIPT"
echo "═══════════════════════════════════════════════════════════"
echo ""

test_js_syntax() {
    local file=$1
    local name=$2
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if [ -f "$file" ]; then
        if node --check "$file" 2>/dev/null; then
            echo -e "${GREEN}✅ $name - Syntaxe correcte${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ $name - Erreur de syntaxe${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  $name - Fichier non trouvé${NC}"
        TESTS_WARNING=$((TESTS_WARNING + 1))
    fi
}

test_js_syntax "backend/server.js" "Backend Server"
test_js_syntax "ai-engine/qwen-integration.js" "AI Engine"
test_js_syntax "frontend/components/dashboard.js" "Frontend Dashboard"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 RÉSUMÉ DES VÉRIFICATIONS"
echo "═══════════════════════════════════════════════════════════"
echo ""

TOTAL_CHECKS=$TESTS_TOTAL
PASS_PERCENT=$((TESTS_PASSED * 100 / TOTAL_CHECKS))

echo "📊 Statistiques:"
echo "   ├─ Tests totaux:    $TESTS_TOTAL"
echo "   ├─ ${GREEN}✅ Réussis:        $TESTS_PASSED ($PASS_PERCENT%)${NC}"
echo "   ├─ ${RED}❌ Échoués:        $TESTS_FAILED${NC}"
echo "   └─ ${YELLOW}⚠️  Avertissements: $TESTS_WARNING${NC}"
echo ""

# Déterminer le statut global
if [ $TESTS_FAILED -eq 0 ]; then
    if [ $TESTS_WARNING -eq 0 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✅ SYSTÈME PARFAITEMENT OPÉRATIONNEL                 ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
        EXIT_CODE=0
    else
        echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${YELLOW}║  ⚠️  SYSTÈME OPÉRATIONNEL AVEC AVERTISSEMENTS         ║${NC}"
        echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
        EXIT_CODE=0
    fi
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ CORRECTIONS NÉCESSAIRES                            ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    EXIT_CODE=1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🚀 PROCHAINES ÉTAPES"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Le système est prêt! Vous pouvez:"
    echo ""
    echo "   1. Lancer l'écosystème unifié:"
    echo "      ${GREEN}./RUN-AURA-UNIFIED.sh${NC}"
    echo ""
    echo "   2. Accéder aux interfaces:"
    echo "      ${GREEN}Frontend: http://localhost:3000${NC}"
    echo "      ${GREEN}Backend API: http://localhost:4011${NC}"
    echo ""
else
    echo "⚠️  Corrigez les problèmes ci-dessus avant de lancer le système"
    echo ""
fi

exit $EXIT_CODE