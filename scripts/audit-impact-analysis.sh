#!/bin/bash
# AURA OSINT - Analyse d'Impact Complète
# Audit avec projection métier et technique

set -e

echo "🔍 AUDIT ULTRA-COMPLET ÉCOSYSTÈME AURA OSINT"
echo "============================================="

# 1. ANALYSE DÉPENDANCES CRITIQUES
echo "📋 1. ANALYSE DÉPENDANCES CRITIQUES"
echo "Vérification références dans le code..."

for file in $(find . -name "*.log" -o -name "*backup*" | grep -v node_modules | head -10); do
    echo "Analysing: $file"
    grep -r "$(basename $file)" --include="*.js" --include="*.json" --include="*.md" . 2>/dev/null | head -3 || echo "  ❌ Aucune référence trouvée"
done

# 2. IMPACT BUSINESS CRITIQUE
echo -e "\n📋 2. IMPACT BUSINESS & SÉCURITÉ"
echo "Vérification conformité RGPD, audit, sécurité..."

# Logs de sécurité critiques
if [ -d "logs/forensic" ]; then
    echo "⚠️  ATTENTION: logs/forensic/ contient des données d'audit"
    echo "   Action recommandée: ARCHIVER hors repo, ne pas supprimer"
fi

# Configs de production
find . -name "*.env*" -o -name "*prod*" | grep -v node_modules | while read config; do
    echo "🔐 Config critique détectée: $config"
    echo "   Action: Vérifier si utilisé en production"
done

# 3. ANALYSE MODULES MÉTIER
echo -e "\n📋 3. ANALYSE MODULES MÉTIER"
echo "Vérification cohérence écosystème AURA..."

# Frontends multiples
echo "Frontend analysis:"
ls -la | grep -E "(frontend|web|react)" | while read line; do
    dir=$(echo $line | awk '{print $9}')
    if [ -d "$dir" ]; then
        echo "  📁 $dir - $(find $dir -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l) fichiers"
    fi
done

# 4. PROJECTION SCALABILITÉ
echo -e "\n📋 4. PROJECTION SCALABILITÉ & ROADMAP"
echo "Impact sur évolution future..."

# Vérifier si modules sont référencés dans roadmap
if [ -f "EXPANSION-ROADMAP.md" ]; then
    echo "✅ Roadmap détectée - vérification références..."
    grep -i "frontend\|web\|react" EXPANSION-ROADMAP.md || echo "  Aucune référence frontend dans roadmap"
fi

echo -e "\n✅ ANALYSE D'IMPACT TERMINÉE"
echo "⚠️  VALIDATION ÉQUIPE REQUISE AVANT TOUTE SUPPRESSION"