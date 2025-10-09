#!/bin/bash
# ✅ Validation complète de la structure AURA OSINT

PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
VITRINE_PATH="marketing/sites/vitrine-aura-advanced-osint-ecosystem"

cd "$PROJECT_ROOT"

echo "✅ VALIDATION STRUCTURE AURA OSINT"
echo "===================================="
echo ""

PASS=0
FAIL=0

check() {
    local description="$1"
    local command="$2"
    
    echo -n "Vérification: $description... "
    
    if eval "$command" &>/dev/null; then
        echo "✅ PASS"
        PASS=$((PASS + 1))
    else
        echo "❌ FAIL"
        FAIL=$((FAIL + 1))
    fi
}

# ========================================
# STRUCTURE FICHIERS
# ========================================
echo "📁 STRUCTURE FICHIERS"
echo "---------------------"

check "Vitrine React présente" "[ -d '$VITRINE_PATH' ]"
check "Backend présent" "[ -d '$VITRINE_PATH/backend' ]"
check "Package.json racine" "[ -f 'package.json' ]"
check "Package.json vitrine" "[ -f '$VITRINE_PATH/package.json' ]"
check "README.md principal" "[ -f 'README.md' ]"

echo ""

# ========================================
# FICHIERS CRITIQUES
# ========================================
echo "🎯 FICHIERS CRITIQUES"
echo "---------------------"

check "App.js" "[ -f '$VITRINE_PATH/src/App.js' ]"
check "index.js" "[ -f '$VITRINE_PATH/src/index.js' ]"
check "Hero3D.jsx" "[ -f '$VITRINE_PATH/src/components/Hero3D.jsx' ]"
check "LiveDemo.jsx" "[ -f '$VITRINE_PATH/src/components/LiveDemo.jsx' ]"
check "Contact.js" "[ -f '$VITRINE_PATH/src/components/Contact.js' ]"
check "Backend server.js" "[ -f '$VITRINE_PATH/backend/server.js' ]"
check "Backend API email" "[ -f '$VITRINE_PATH/backend/api/send-email.js' ]"

echo ""

# ========================================
# CONFIGURATION
# ========================================
echo "⚙️  CONFIGURATION"
echo "-----------------"

check ".env.example backend" "[ -f '$VITRINE_PATH/backend/.env.example' ]"
check ".gitignore" "[ -f '.gitignore' ]"

echo ""

# ========================================
# IMPORTS PROPRES
# ========================================
echo "🔍 ANALYSE IMPORTS"
echo "------------------"

OBSOLETE_IMPORTS=$(grep -r "require.*\.\./\.\./src" . --include="*.js" --include="*.jsx" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.backup*" 2>/dev/null | wc -l)

if [ $OBSOLETE_IMPORTS -eq 0 ]; then
    echo "✅ PASS: Aucun import obsolète"
    PASS=$((PASS + 1))
else
    echo "❌ FAIL: $OBSOLETE_IMPORTS imports obsolètes détectés"
    FAIL=$((FAIL + 1))
fi

echo ""

# ========================================
# DÉPENDANCES
# ========================================
echo "📦 DÉPENDANCES"
echo "--------------"

cd "$VITRINE_PATH"

if [ -d "node_modules" ]; then
    echo "✅ PASS: node_modules présent"
    PASS=$((PASS + 1))
else
    echo "❌ FAIL: node_modules manquant (npm install requis)"
    FAIL=$((FAIL + 1))
fi

cd "$PROJECT_ROOT"

echo ""

# ========================================
# SCRIPTS NPM
# ========================================
echo "🛠️  SCRIPTS NPM"
echo "---------------"

cd "$VITRINE_PATH"

SCRIPTS=("start" "build" "test")

for script in "${SCRIPTS[@]}"; do
    if grep -q "\"$script\":" package.json; then
        echo "✅ PASS: Script '$script' défini"
        PASS=$((PASS + 1))
    else
        echo "❌ FAIL: Script '$script' manquant"
        FAIL=$((FAIL + 1))
    fi
done

cd "$PROJECT_ROOT"

echo ""

# ========================================
# SÉCURITÉ
# ========================================
echo "🔐 SÉCURITÉ"
echo "-----------"

# .env ne doit PAS être commité
if git ls-files --error-unmatch "$VITRINE_PATH/backend/.env" &>/dev/null; then
    echo "❌ FAIL: .env commité (DANGER !)"
    FAIL=$((FAIL + 1))
else
    echo "✅ PASS: .env non commité"
    PASS=$((PASS + 1))
fi

# .gitignore doit contenir .env
if grep -q "\.env" .gitignore; then
    echo "✅ PASS: .env dans .gitignore"
    PASS=$((PASS + 1))
else
    echo "❌ FAIL: .env manquant dans .gitignore"
    FAIL=$((FAIL + 1))
fi

echo ""

# ========================================
# RAPPORT FINAL
# ========================================
TOTAL=$((PASS + FAIL))
PERCENT=$((PASS * 100 / TOTAL))

echo "===================================="
echo "📊 RAPPORT FINAL"
echo "===================================="
echo ""
echo "Tests réussis:  $PASS/$TOTAL ($PERCENT%)"
echo "Tests échoués:  $FAIL/$TOTAL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 PARFAIT ! Structure 100% validée"
    echo ""
    echo "✅ Prêt pour:"
    echo "  - npm start (dev server)"
    echo "  - npm run build (production)"
    echo "  - npm test (tests unitaires)"
    echo ""
    exit 0
elif [ $PERCENT -ge 80 ]; then
    echo "⚠️  Structure OK mais quelques ajustements nécessaires"
    echo ""
    echo "🔧 Lancez: bash scripts/fix-reorganization.sh"
    echo ""
    exit 1
else
    echo "❌ Structure nécessite corrections majeures"
    echo ""
    echo "🔧 Lancez: bash scripts/fix-reorganization.sh"
    echo ""
    exit 2
fi