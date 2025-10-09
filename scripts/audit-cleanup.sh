#!/bin/bash
# AURA OSINT - Audit et Nettoyage Automatisé
# Author: Sofiane Kaabache

set -e

echo "🔍 AUDIT MANUEL ÉCOSYSTÈME AURA OSINT"
echo "===================================="

# 1. LOGS ET BACKUPS À SUPPRIMER
echo "📋 1. Fichiers logs et backups suspects:"
find . -name "*.log" -o -name "*.bak" -o -name "*backup*" | grep -v node_modules | sort

# 2. DOSSIERS DUPLIQUÉS
echo -e "\n📋 2. Dossiers frontend dupliqués:"
find . -maxdepth 2 -name "*frontend*" -o -name "*web*" -o -name "*backup*" | grep -v node_modules | sort

# 3. ASSETS NON RÉFÉRENCÉS
echo -e "\n📋 3. Assets potentiellement non utilisés:"
find assets/ -name "*.png" -o -name "*.jpg" -o -name "*.svg" 2>/dev/null | head -10

# 4. CONFIGS OBSOLÈTES
echo -e "\n📋 4. Configs obsolètes:"
find . -name ".env*" -o -name "config*.json" -o -name "*.config.js" | grep -v node_modules | head -10

# 5. SCRIPTS OBSOLÈTES
echo -e "\n📋 5. Scripts potentiellement obsolètes:"
find scripts/ -name "*old*" -o -name "*backup*" -o -name "*temp*" 2>/dev/null

# 6. DÉPENDANCES NON UTILISÉES
echo -e "\n📋 6. Analyse dépendances (si pnpm disponible):"
if command -v pnpm &> /dev/null; then
    pnpm ls --depth=0 | grep -E "(WARN|unused)" || echo "Aucune dépendance suspecte détectée"
fi

echo -e "\n✅ AUDIT TERMINÉ - Vérifiez chaque élément avant suppression"