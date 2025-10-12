#!/bin/bash

echo "🔍 VÉRIFICATION FINALE - NETTOYAGE COMPLET"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCORE=0
TOTAL=10

# 1. Vérifier .gitignore
echo "1️⃣  Vérification .gitignore..."
if grep -q "venv-osint/" .gitignore && grep -q "node_modules/" .gitignore; then
    echo -e "${GREEN}✅ .gitignore complet${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ .gitignore incomplet${NC}"
fi

# 2. Vérifier structure scripts/
echo "2️⃣  Vérification structure scripts/..."
if [ -d "scripts/audit" ] && [ -d "scripts/install" ] && [ -d "scripts/maintenance" ]; then
    echo -e "${GREEN}✅ Structure scripts/ OK${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ Structure scripts/ manquante${NC}"
fi

# 3. Vérifier structure docs/
echo "3️⃣  Vérification structure docs/..."
if [ -d "docs/guides" ] && [ -d "docs/reports" ]; then
    echo -e "${GREEN}✅ Structure docs/ OK${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ Structure docs/ manquante${NC}"
fi

# 4. Vérifier structure server/
echo "4️⃣  Vérification structure server/..."
if [ -d "server/config" ] && [ -f "server/config/ports.json" ]; then
    echo -e "${GREEN}✅ Structure server/ OK${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ Structure server/ manquante${NC}"
fi

# 5. Vérifier absence scripts racine
echo "5️⃣  Vérification scripts racine..."
SCRIPTS_RACINE=$(find . -maxdepth 1 -name "*.sh" -type f | wc -l)
if [ "$SCRIPTS_RACINE" -eq 0 ]; then
    echo -e "${GREEN}✅ Aucun script racine${NC}"
    ((SCORE++))
else
    echo -e "${YELLOW}⚠️  $SCRIPTS_RACINE scripts encore en racine${NC}"
fi

# 6. Vérifier rapports phases
echo "6️⃣  Vérification rapports phases..."
if [ -f "PHASE1-RAPPORT.md" ] && [ -f "scripts/maintenance/PHASE2-RAPPORT.md" ]; then
    echo -e "${GREEN}✅ Rapports phases présents${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ Rapports phases manquants${NC}"
fi

# 7. Vérifier synthèse finale
echo "7️⃣  Vérification synthèse finale..."
if [ -f "NETTOYAGE-COMPLET-SYNTHESE.md" ]; then
    echo -e "${GREEN}✅ Synthèse finale présente${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ Synthèse finale manquante${NC}"
fi

# 8. Vérifier Git propre
echo "8️⃣  Vérification Git status..."
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Git propre (rien à commiter)${NC}"
    ((SCORE++))
else
    echo -e "${YELLOW}⚠️  Modifications non commitées${NC}"
fi

# 9. Vérifier taille .git
echo "9️⃣  Vérification taille .git..."
GIT_SIZE=$(du -sm .git | cut -f1)
if [ "$GIT_SIZE" -lt 600 ]; then
    echo -e "${GREEN}✅ Taille .git acceptable (${GIT_SIZE}MB)${NC}"
    ((SCORE++))
else
    echo -e "${YELLOW}⚠️  Taille .git élevée (${GIT_SIZE}MB)${NC}"
fi

# 10. Vérifier backup
echo "🔟 Vérification backup..."
if ls ~/aura-backup-*.tar.gz 1> /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backup présent${NC}"
    ((SCORE++))
else
    echo -e "${RED}❌ Backup manquant${NC}"
fi

# Score final
echo ""
echo "=========================================="
echo "📊 SCORE FINAL: $SCORE/$TOTAL"
echo "=========================================="

if [ "$SCORE" -eq "$TOTAL" ]; then
    echo -e "${GREEN}🎉 PARFAIT ! Nettoyage 100% réussi${NC}"
elif [ "$SCORE" -ge 8 ]; then
    echo -e "${GREEN}✅ EXCELLENT ! Nettoyage réussi${NC}"
elif [ "$SCORE" -ge 6 ]; then
    echo -e "${YELLOW}⚠️  BON - Quelques améliorations possibles${NC}"
else
    echo -e "${RED}❌ INSUFFISANT - Relancer les phases${NC}"
fi

echo ""
echo "📋 Détails complets:"
echo "   cat NETTOYAGE-COMPLET-SYNTHESE.md"
