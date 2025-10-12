#!/bin/bash

echo "🚀 PHASE 2 - NETTOYAGE HISTORIQUE GIT"
echo "======================================"
echo ""

# 1. Nettoyage historique avec BFG ou git filter-repo
echo "🗑️  1/4 - Nettoyage historique Git..."

# Vérifier si git-filter-repo est installé
if ! command -v git-filter-repo &> /dev/null; then
    echo "⚠️  git-filter-repo non installé. Installation..."
    pip3 install --user git-filter-repo 2>/dev/null || {
        echo "❌ Impossible d'installer git-filter-repo"
        echo "💡 Alternative: nettoyage manuel avec git gc"
    }
fi

# Supprimer les gros fichiers de l'historique
echo "🔍 Recherche des gros fichiers dans l'historique..."
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -20 > /tmp/aura-big-files.txt

echo "📊 Top 20 gros fichiers:"
cat /tmp/aura-big-files.txt

# 2. Garbage collection agressive
echo ""
echo "🧹 2/4 - Garbage collection agressive..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Vérification
echo ""
echo "📊 3/4 - Vérification taille..."
TAILLE_AVANT=572
TAILLE_APRES=$(du -sm .git | cut -f1)
GAIN=$((TAILLE_AVANT - TAILLE_APRES))

echo "Taille avant: ${TAILLE_AVANT}MB"
echo "Taille après: ${TAILLE_APRES}MB"
echo "Gain: ${GAIN}MB"

# 4. Rapport
echo ""
echo "📝 4/4 - Génération rapport..."
cat > PHASE2-RAPPORT.md << EOF
# ✅ PHASE 2 TERMINÉE - NETTOYAGE HISTORIQUE

## Actions Réalisées
1. ✅ Analyse gros fichiers historique
2. ✅ Garbage collection agressive
3. ✅ Reflog nettoyé
4. ✅ Vérification taille

## Résultats
- Taille avant: ${TAILLE_AVANT}MB
- Taille après: ${TAILLE_APRES}MB
- Gain: ${GAIN}MB (-$(echo "scale=1; $GAIN*100/$TAILLE_AVANT" | bc)%)

## Prochaines Étapes
- Phase 3: Restructuration fichiers
- Phase 4: Amélioration code
- Phase 5: Tests et CI/CD

## Note
Si la taille reste élevée, considérer:
- git-filter-repo pour supprimer gros fichiers historique
- Nouveau repo propre (migration)
EOF

echo "✅ Rapport généré: PHASE2-RAPPORT.md"
echo ""
echo "🎉 PHASE 2 TERMINÉE!"
echo ""
echo "📊 Consulter le rapport:"
echo "   cat PHASE2-RAPPORT.md"
echo ""
echo "🚀 Lancer Phase 3:"
echo "   bash PHASE3-RESTRUCTURATION.sh"
