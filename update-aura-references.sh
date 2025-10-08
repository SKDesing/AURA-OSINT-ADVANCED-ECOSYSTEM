#!/bin/bash

echo "🔄 MISE À JOUR RÉFÉRENCES AURA ECOSYSTEM"
echo "========================================"

# Mettre à jour README.md
echo "📝 Mise à jour README.md..."
sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' README.md
sed -i 's/SKDesing\/TikTok-Live-Analyser/SKDesing\/AURA-OSINT-ADVANCED-ECOSYSTEM/g' README.md

# Mettre à jour package.json
echo "📦 Mise à jour package.json..."
sed -i 's/"name": ".*"/"name": "@aura\/osint-advanced-ecosystem"/g' package.json
sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' package.json

# Mettre à jour les workflows GitHub Actions
echo "🔧 Mise à jour GitHub Actions..."
find .github/workflows -name "*.yml" -exec sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' {} \;

# Mettre à jour la vitrine
echo "🎨 Mise à jour vitrine..."
if [ -f "marketing/sites/vitrine-aura-advanced-osint-ecosystem/README.md" ]; then
    sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' marketing/sites/vitrine-aura-advanced-osint-ecosystem/README.md
fi

# Mettre à jour les scripts
echo "📜 Mise à jour scripts..."
find scripts -name "*.js" -o -name "*.sh" | xargs sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' 2>/dev/null || true

echo ""
echo "✅ RÉFÉRENCES MISES À JOUR!"
echo ""
echo "📋 FICHIERS MODIFIÉS:"
echo "• README.md"
echo "• package.json"
echo "• .github/workflows/*.yml"
echo "• marketing/sites/vitrine-aura-advanced-osint-ecosystem/"
echo "• scripts/"
echo ""
echo "🔍 VÉRIFICATION:"
grep -r "TikTok-Live-Analyser" . --exclude-dir=node_modules --exclude-dir=.git | head -5 || echo "✅ Aucune référence restante trouvée"