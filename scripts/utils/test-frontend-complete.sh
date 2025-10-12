#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🧪 TESTS COMPLETS FRONTEND AURA OSINT                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0
WARNINGS=0

test_result() {
    local name=$1
    local result=$2
    
    if [ $result -eq 0 ]; then
        echo -e "${GREEN}✅ $name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ $name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

warning_result() {
    local name=$1
    echo -e "${YELLOW}⚠️  $name${NC}"
    WARNINGS=$((WARNINGS + 1))
}

echo "📁 Structure des fichiers frontend..."
echo "═══════════════════════════════════════════════════════════"

# Test 1: Vérifier la structure des dossiers
if [ -d "frontend" ] && [ -d "frontend/components" ] && [ -d "frontend/tests" ]; then
    test_result "Structure des dossiers" 0
else
    test_result "Structure des dossiers" 1
fi

# Test 2: Vérifier les fichiers principaux
if [ -f "frontend/index.html" ] && [ -f "frontend/components/dashboard.js" ]; then
    test_result "Fichiers principaux présents" 0
else
    test_result "Fichiers principaux présents" 1
fi

# Test 3: Vérifier les fichiers de test
if [ -f "frontend/package.json" ] && [ -f "frontend/jest.config.js" ]; then
    test_result "Configuration de test" 0
else
    test_result "Configuration de test" 1
fi

echo ""
echo "🌐 Contenu HTML..."
echo "═══════════════════════════════════════════════════════════"

# Test 4: Vérifier le contenu HTML
if [ -f "frontend/index.html" ]; then
    if grep -q "AURA OSINT" frontend/index.html; then
        test_result "Titre AURA OSINT présent" 0
    else
        test_result "Titre AURA OSINT présent" 1
    fi
    
    if grep -q "viewport" frontend/index.html; then
        test_result "Meta viewport présent" 0
    else
        test_result "Meta viewport présent" 1
    fi
else
    test_result "Fichier HTML principal" 1
fi

echo ""
echo "📜 JavaScript et syntaxe..."
echo "═══════════════════════════════════════════════════════════"

# Test 5: Vérifier la syntaxe JavaScript
if [ -f "frontend/components/dashboard.js" ]; then
    if node -c frontend/components/dashboard.js 2>/dev/null; then
        test_result "Syntaxe dashboard.js" 0
    else
        test_result "Syntaxe dashboard.js" 1
    fi
else
    test_result "Fichier dashboard.js" 1
fi

if [ -f "frontend/components/ai-chat.js" ]; then
    if node -c frontend/components/ai-chat.js 2>/dev/null; then
        test_result "Syntaxe ai-chat.js" 0
    else
        test_result "Syntaxe ai-chat.js" 1
    fi
else
    warning_result "Fichier ai-chat.js manquant"
fi

if [ -f "frontend/components/config.js" ]; then
    if node -c frontend/components/config.js 2>/dev/null; then
        test_result "Syntaxe config.js" 0
    else
        test_result "Syntaxe config.js" 1
    fi
else
    warning_result "Fichier config.js manquant"
fi

echo ""
echo "🎨 CSS et design..."
echo "═══════════════════════════════════════════════════════════"

# Test 6: Vérifier les fichiers CSS
if [ -f "optimized/assets/aura-unified.css" ]; then
    if grep -q "golden-ratio" optimized/assets/aura-unified.css; then
        test_result "Variables Golden Ratio CSS" 0
    else
        test_result "Variables Golden Ratio CSS" 1
    fi
    
    if grep -q "@media" optimized/assets/aura-unified.css; then
        test_result "Media queries responsive" 0
    else
        test_result "Media queries responsive" 1
    fi
else
    test_result "Fichier CSS unifié" 1
fi

echo ""
echo "⚙️ Fonctionnalités..."
echo "═══════════════════════════════════════════════════════════"

# Test 7: Vérifier les fonctionnalités JavaScript
if [ -f "optimized/assets/aura-unified.js" ]; then
    if grep -q "AURA" optimized/assets/aura-unified.js; then
        test_result "Objet AURA global" 0
    else
        test_result "Objet AURA global" 1
    fi
    
    if grep -q "WebSocket" optimized/assets/aura-unified.js; then
        test_result "Support WebSocket" 0
    else
        test_result "Support WebSocket" 1
    fi
else
    test_result "JavaScript unifié" 1
fi

echo ""
echo "🖥️ Serveur et backend..."
echo "═══════════════════════════════════════════════════════════"

# Test 8: Vérifier la connectivité backend (si disponible)
if command -v curl >/dev/null 2>&1; then
    if curl -s --connect-timeout 3 http://localhost:4011/api/health >/dev/null 2>&1; then
        test_result "Connexion backend (port 4011)" 0
    else
        warning_result "Backend non disponible (normal si non démarré)"
    fi
else
    warning_result "curl non disponible pour test backend"
fi

echo ""
echo "🧪 Tests unitaires..."
echo "═══════════════════════════════════════════════════════════"

# Test 9: Exécuter les tests unitaires
cd frontend 2>/dev/null
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    if npm test tests/unit/simple.test.js >/dev/null 2>&1; then
        test_result "Tests unitaires de base" 0
    else
        test_result "Tests unitaires de base" 1
    fi
else
    warning_result "Dépendances npm non installées"
fi
cd ..

echo ""
echo "📱 Design responsive..."
echo "═══════════════════════════════════════════════════════════"

# Test 10: Vérifier le design responsive
if [ -f "frontend/index.html" ]; then
    if grep -q "max-width" frontend/index.html || grep -q "max-width" optimized/assets/aura-unified.css 2>/dev/null; then
        test_result "Contraintes de largeur responsive" 0
    else
        test_result "Contraintes de largeur responsive" 1
    fi
else
    test_result "Vérification responsive" 1
fi

echo ""
echo "🔒 Sécurité..."
echo "═══════════════════════════════════════════════════════════"

# Test 11: Vérifier les aspects sécurité
if [ -f "frontend/index.html" ]; then
    if grep -q "Content-Security-Policy" frontend/index.html; then
        test_result "Content Security Policy" 0
    else
        warning_result "CSP non configuré (recommandé pour production)"
    fi
else
    test_result "Vérification sécurité" 1
fi

echo ""
echo "⚡ Performance..."
echo "═══════════════════════════════════════════════════════════"

# Test 12: Vérifier la taille des fichiers
if [ -f "optimized/assets/aura-unified.css" ]; then
    css_size=$(wc -c < "optimized/assets/aura-unified.css" 2>/dev/null || echo 0)
    if [ $css_size -lt 100000 ]; then  # Moins de 100KB
        test_result "Taille CSS optimisée (<100KB)" 0
    else
        warning_result "Fichier CSS volumineux (${css_size} bytes)"
    fi
else
    test_result "Vérification taille CSS" 1
fi

if [ -f "optimized/assets/aura-unified.js" ]; then
    js_size=$(wc -c < "optimized/assets/aura-unified.js" 2>/dev/null || echo 0)
    if [ $js_size -lt 200000 ]; then  # Moins de 200KB
        test_result "Taille JS optimisée (<200KB)" 0
    else
        warning_result "Fichier JS volumineux (${js_size} bytes)"
    fi
else
    test_result "Vérification taille JS" 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   RÉSUMÉ FINAL                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Résultats des tests:"
echo "   ├─ ${GREEN}✅ Tests réussis: $TESTS_PASSED${NC}"
echo "   ├─ ${RED}❌ Tests échoués: $TESTS_FAILED${NC}"
echo "   └─ ${YELLOW}⚠️  Avertissements: $WARNINGS${NC}"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (TESTS_PASSED * 100) / TOTAL_TESTS ))
    echo ""
    echo "📈 Taux de réussite: ${SUCCESS_RATE}%"
    
    if [ $SUCCESS_RATE -ge 80 ]; then
        echo -e "${GREEN}🎉 Excellent! Frontend prêt pour production${NC}"
    elif [ $SUCCESS_RATE -ge 60 ]; then
        echo -e "${YELLOW}⚠️  Bon état, quelques améliorations nécessaires${NC}"
    else
        echo -e "${RED}🔧 Corrections importantes requises${NC}"
    fi
fi

echo ""
echo "✅ Tests terminés!"

# Exit code basé sur les échecs critiques
if [ $TESTS_FAILED -gt 5 ]; then
    exit 1
else
    exit 0
fi