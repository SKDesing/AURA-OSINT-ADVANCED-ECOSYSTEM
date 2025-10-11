#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🧪 BATTERIE DE TESTS COMPLÈTE AURA OSINT FRONTEND      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd frontend

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

run_test_suite() {
    local name=$1
    local command=$2
    
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "🧪 $name"
    echo "═══════════════════════════════════════════════════════════"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $name - RÉUSSI${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ $name - ÉCHOUÉ${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# 1. Tests unitaires
run_test_suite "Tests Unitaires" "npm run test:unit"

# 2. Tests de coverage
run_test_suite "Coverage Report" "npm run test:coverage"

# Résumé
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   RÉSUMÉ DES TESTS                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Suites de tests:"
echo "   ├─ ${GREEN}✅ Réussies: $TESTS_PASSED${NC}"
echo "   └─ ${RED}❌ Échouées: $TESTS_FAILED${NC}"
echo ""

if [ -d "coverage" ]; then
    echo "📄 Rapport de coverage généré: frontend/coverage/lcov-report/index.html"
fi

echo ""
echo "✅ Tests terminés!"

# Exit code
if [ $TESTS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi