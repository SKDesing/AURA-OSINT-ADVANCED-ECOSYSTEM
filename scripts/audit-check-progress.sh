#!/bin/bash
# 📊 Vérifier progression remplissage questionnaire Audit Ultimate v2

PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
cd "$PROJECT_ROOT"

echo "📊 PROGRESSION QUESTIONNAIRE AUDIT ULTIMATE V2"
echo "==============================================="
echo ""

# Chercher fichier réponses
RESPONSE_FILE="AUDIT-ECOSYSTEM-ULTIMATE-V2-REPONSES.md"
if [ ! -f "$RESPONSE_FILE" ]; then
    echo "❌ Fichier réponses non trouvé: $RESPONSE_FILE"
    echo ""
    echo "💡 Créez-le d'abord:"
    echo "   cp AUDIT-ECOSYSTEM-ULTIMATE-V2.md AUDIT-ECOSYSTEM-ULTIMATE-V2-REPONSES.md"
    echo ""
    exit 1
fi

echo "📁 Fichier: $RESPONSE_FILE"
echo ""

# Compter questions non remplies (approximation)
TOTAL=11  # Questions dans notre version simplifiée
PLACEHOLDERS=$(grep -o "\[VOTRE.*\]\|\[RÉPONSE\]\|\[DESCRIPTION\]\|\[LISTEZ\]" "$RESPONSE_FILE" 2>/dev/null | wc -l)
REMAINING=$PLACEHOLDERS
DONE=$((TOTAL - (REMAINING / 2))) # Approximation

if [ $DONE -lt 0 ]; then
    DONE=0
fi
if [ $DONE -gt $TOTAL ]; then
    DONE=$TOTAL
fi

PERCENT=$((DONE * 100 / TOTAL))

echo "✅ Complété: $DONE/$TOTAL questions (${PERCENT}%)"
echo "⏳ Restant: $((TOTAL - DONE)) questions (estimation)"
echo ""

# Barre de progression
PROGRESS_BAR=""
FILLED=$((PERCENT / 2))
EMPTY=$((50 - FILLED))

for ((i=0; i<$FILLED; i++)); do
    PROGRESS_BAR+="█"
done
for ((i=0; i<$EMPTY; i++)); do
    PROGRESS_BAR+="░"
done

echo "[$PROGRESS_BAR] ${PERCENT}%"
echo ""

# Message encouragement
if [ $PERCENT -eq 100 ]; then
    echo "🎉 TERMINÉ ! Prêt pour commit & push"
    echo ""
    echo "📤 Prochaines étapes:"
    echo "   git add $RESPONSE_FILE"
    echo "   git commit -m \"📋 Audit Ultimate v2 - Réponses complètes\""
    echo "   git push origin audit/ultimate-v2"
elif [ $PERCENT -ge 75 ]; then
    echo "💪 Presque fini ! Encore un effort"
elif [ $PERCENT -ge 50 ]; then
    echo "👍 À mi-chemin, continue comme ça"
elif [ $PERCENT -ge 25 ]; then
    echo "🚀 Bon démarrage, keep going"
else
    echo "⏰ Il reste du boulot, courage !"
fi

echo ""
echo "🎯 Objectif: Directives ultra-ciblées pour révolutionner AURA OSINT !"
echo ""