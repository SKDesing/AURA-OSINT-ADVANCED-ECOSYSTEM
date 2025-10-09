#!/bin/bash
# 🔧 Fix complet de la vitrine AURA OSINT

PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
VITRINE_PATH="$PROJECT_ROOT/marketing/sites/vitrine-aura-advanced-osint-ecosystem"

cd "$VITRINE_PATH"

echo "🔧 CORRECTION COMPLÈTE VITRINE AURA"
echo "===================================="
echo ""

# 1. Nettoyer node_modules et package-lock
echo "1️⃣  Nettoyage dépendances..."
rm -rf node_modules package-lock.json

# 2. Installer toutes les dépendances manquantes
echo "2️⃣  Installation dépendances complètes..."
npm install \
  lucide-react \
  styled-components \
  @babel/runtime \
  @babel/core \
  @babel/preset-env \
  @babel/preset-react

# 3. Corriger les chemins absolus dans les fichiers
echo "3️⃣  Correction chemins absolus..."
find src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's|/home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM|/home/soufiane/TikTok-Live-Analyser|g' {} \;

# 4. Test build
echo "4️⃣  Test build..."
if npm run build; then
    echo "✅ Build réussi!"
    BUILD_SIZE=$(du -sh build 2>/dev/null | awk '{print $1}')
    echo "📦 Taille build: $BUILD_SIZE"
else
    echo "❌ Build échoué - diagnostic..."
    
    # Diagnostic approfondi
    echo ""
    echo "🔍 DIAGNOSTIC:"
    echo "- Vérification React:"
    npm list react react-dom react-scripts
    
    echo ""
    echo "- Fichiers problématiques:"
    find src -name "*.js" -o -name "*.jsx" | head -5
    
    echo ""
    echo "- Imports problématiques:"
    grep -r "from.*AURA-OSINT" src/ || echo "Aucun trouvé"
fi

echo ""
echo "✅ Correction terminée"