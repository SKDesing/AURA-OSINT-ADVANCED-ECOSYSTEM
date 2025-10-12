#!/bin/bash

echo "🧹 DÉPLACEMENT SCRIPTS RACINE"
echo "═════════════════════════════"
echo ""

# Créer dossiers si nécessaire
mkdir -p scripts/{utils,build}

# Trouver scripts racine
SCRIPTS=$(find . -maxdepth 1 -name "*.sh" -type f)
COUNT=$(echo "$SCRIPTS" | wc -l)

if [ -z "$SCRIPTS" ]; then
    echo "✅ Aucun script en racine"
    exit 0
fi

echo "📋 $COUNT scripts trouvés:"
echo "$SCRIPTS"
echo ""

# Déplacer automatiquement
for script in $SCRIPTS; do
    filename=$(basename "$script")
    
    # Déterminer destination
    if [[ "$filename" =~ ^INSTALL ]]; then
        dest="scripts/install/"
    elif [[ "$filename" =~ ^AUDIT ]]; then
        dest="scripts/audit/"
    elif [[ "$filename" =~ ^BUILD|^build ]]; then
        dest="scripts/build/"
    elif [[ "$filename" =~ ^PHASE|^phase ]]; then
        dest="scripts/maintenance/"
    elif [[ "$filename" =~ launcher|command ]]; then
        dest="scripts/"
    else
        dest="scripts/utils/"
    fi
    
    echo "📦 $filename → $dest"
    mv "$script" "$dest"
done

git add -A
git commit -m "♻️ Refactor: Déplacement scripts racine restants"

echo ""
echo "✅ Scripts déplacés et commités!"
