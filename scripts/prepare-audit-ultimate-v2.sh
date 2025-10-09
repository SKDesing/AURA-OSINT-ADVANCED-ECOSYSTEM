#!/bin/bash
# 🎯 Préparation environnement Audit Ultimate v2

set -e
PROJECT_ROOT="/home/soufiane/TikTok-Live-Analyser"
cd "$PROJECT_ROOT"

echo "🎯 PRÉPARATION AUDIT ULTIME V2 (POST-RÉORGANISATION)"
echo "====================================================="
echo ""

# 1. Créer branche dédiée
echo "1️⃣  Création branche audit v2..."
git checkout -b audit/ultimate-v2 2>/dev/null || git checkout audit/ultimate-v2
echo "✅ Branche 'audit/ultimate-v2' active"
echo ""

# 2. Copier questionnaire pour réponses
echo "2️⃣  Création fichier réponses..."
if [ ! -f "AUDIT-ECOSYSTEM-ULTIMATE-V2-REPONSES.md" ]; then
    cp AUDIT-ECOSYSTEM-ULTIMATE-V2.md AUDIT-ECOSYSTEM-ULTIMATE-V2-REPONSES.md
    echo "✅ Fichier créé: AUDIT-ECOSYSTEM-ULTIMATE-V2-REPONSES.md"
else
    echo "⚠️  Fichier réponses existe déjà (non écrasé)"
fi
echo ""

# 3. Créer dossiers audit
echo "3️⃣  Création structure dossiers..."
mkdir -p audit/{reports,diagrams,metrics,screenshots}
echo "✅ Dossiers créés:"
echo "   - audit/reports (analyses détaillées)"
echo "   - audit/diagrams (schémas architecture)"
echo "   - audit/metrics (résultats Lighthouse, tests)"
echo "   - audit/screenshots (captures d'écran)"
echo ""

# 4. Commit initial
echo "4️⃣  Commit initial..."
git add . 2>/dev/null || true
git commit -m "🎯 Audit Ultimate v2 - Setup initial" 2>/dev/null || echo "⚠️  Déjà commité"
echo ""

echo "════════════════════════════════════════════════"
echo "✅ PRÉPARATION AUDIT V2 TERMINÉE"
echo "════════════════════════════════════════════════"
echo ""
echo "🚀 PROCHAINES ÉTAPES:"
echo "  1. Envoyer email à l'équipe"
echo "  2. Équipe remplit AUDIT-ECOSYSTEM-ULTIMATE-V2-REPONSES.md"
echo "  3. Vérifier progression: bash scripts/audit-check-progress.sh"
echo ""