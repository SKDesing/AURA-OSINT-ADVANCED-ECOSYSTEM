#!/bin/bash
# ============================================
# SCRIPT: audit-codebase.sh
# Analyse complète structure projet AURA
# ============================================

echo "🔍 AUDIT AURA OSINT - $(date)"
echo "======================================"

# Create audit directory
mkdir -p docs/audit

# 1. Structure fichiers
echo "📁 ARBORESCENCE:"
if command -v tree >/dev/null 2>&1; then
    tree -L 4 -I 'node_modules|.git|.next|dist|build' > docs/audit/structure.txt
else
    find . -type d -name "node_modules" -prune -o -type d -name ".git" -prune -o -type f -print | head -100 > docs/audit/structure.txt
fi

# 2. Statistiques code
echo "📊 STATISTIQUES:"
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l > docs/audit/file-count.txt
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs wc -l | tail -1 > docs/audit/line-count.txt

# 3. Dépendances
echo "📦 DÉPENDANCES:"
npm list --depth=0 > docs/audit/dependencies.txt 2>/dev/null || echo "npm list failed" > docs/audit/dependencies.txt
npm outdated > docs/audit/outdated.txt 2>/dev/null || echo "No outdated packages" > docs/audit/outdated.txt

# 4. Doublons potentiels (simplified)
echo "🔄 DOUBLONS:"
find . -name "*.js" -not -path "./node_modules/*" -exec basename {} \; | sort | uniq -d > docs/audit/duplicate-names.txt

# 5. Sécurité
echo "🔒 VULNÉRABILITÉS:"
npm audit --json > docs/audit/security.json 2>/dev/null || echo '{"vulnerabilities": {}}' > docs/audit/security.json

# 6. Taille des dossiers
echo "📦 TAILLES:"
du -sh */ 2>/dev/null | sort -hr > docs/audit/folder-sizes.txt

# 7. Fichiers de configuration
echo "⚙️ CONFIGURATIONS:"
find . -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.env*" | grep -v node_modules > docs/audit/config-files.txt

# 8. Scripts et executables
echo "🚀 SCRIPTS:"
find . -name "*.sh" -o -name "*.bat" | grep -v node_modules > docs/audit/scripts.txt

echo "✅ Audit terminé - Voir docs/audit/"
echo "📊 Résumé:"
echo "   - Fichiers JS/TS: $(cat docs/audit/file-count.txt)"
echo "   - Lignes de code: $(cat docs/audit/line-count.txt | awk '{print $1}')"
echo "   - Configurations: $(wc -l < docs/audit/config-files.txt)"
echo "   - Scripts: $(wc -l < docs/audit/scripts.txt)"