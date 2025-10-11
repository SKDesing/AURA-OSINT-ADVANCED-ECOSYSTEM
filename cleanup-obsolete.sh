#!/bin/bash

echo "🧹 NETTOYAGE DES FICHIERS OBSOLÈTES - AURA OSINT"
echo "════════════════════════════════════════════════════════════"

# Créer un dossier d'archive pour les fichiers obsolètes
mkdir -p archive/obsolete

# Liste des fichiers obsolètes à archiver
OBSOLETE_FILES=(
    "launch-aura-complete.js"
    "launch-aura-fixed.js"
    "launch-aura-configured.js"
    "launch-full-ecosystem.js"
    "start-ecosystem.sh"
    "quick-fix.sh"
    "STOP-ALL.sh"
    "scan-ecosystem-ports.sh"
)

echo "📦 Archivage des fichiers obsolètes..."

for file in "${OBSOLETE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   Archivage: $file"
        mv "$file" "archive/obsolete/"
    fi
done

# Archiver les anciennes versions du moteur dans le dossier aura-browser
if [ -d "aura-browser" ]; then
    cd aura-browser
    
    OBSOLETE_BROWSER_FILES=(
        "chromium-engine.js"
        "chromium-engine-v2.js"
        "chromium-engine-simple.js"
    )
    
    for file in "${OBSOLETE_BROWSER_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "   Archivage: aura-browser/$file"
            mkdir -p ../archive/obsolete/aura-browser
            mv "$file" "../archive/obsolete/aura-browser/"
        fi
    done
    
    cd ..
fi

echo "✅ Nettoyage terminé"
echo "📁 Fichiers obsolètes archivés dans: archive/obsolete/"