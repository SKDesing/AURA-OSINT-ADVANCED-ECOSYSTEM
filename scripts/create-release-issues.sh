#!/usr/bin/env bash
set -euo pipefail

echo "🚨 Création des 47 release blockers en issues GitHub..."

# P0 Blockers - Critiques
declare -a P0_BLOCKERS=(
  "SECRETS DANS GIT"
  "STRUCTURE MONOREPO CASSÉE" 
  "BUILD PIPELINE CASSÉ"
  "CORE CONSOLIDATION"
  "GESTION SECRETS PRODUCTION"
)

# P1 Blockers - Majeurs
declare -a P1_BLOCKERS=(
  "STEALTH BROWSER INSTABLE"
  "DOCUMENTATION UTILISATEUR 0%"
  "TESTS UNITAIRES 0%"
  "CONFORMITÉ RGPD 0%"
  "MULTI-PLATFORM 25%"
  "API ENDPOINTS INSTABLES"
  "DATABASE SCHEMA INCOHÉRENT"
  "MONITORING BASIQUE"
  "DESIGN NON FINALISÉ"
  "USER MANAGEMENT MANQUANT"
  "QWEN2 INSTABLE"
  "TRAINING DATA INSUFFISANT"
  "CHIFFREMENT MANQUANT"
  "AUDIT TRAIL INCOMPLET"
  "DOCKER INSTABLE"
  "BACKUP NON TESTÉ"
)

create_issue() {
  local title="$1"
  local priority="$2"
  local labels="release-blocker,$priority"
  
  # Déterminer l'area
  local area=""
  case "$title" in
    *SECRET*|*SECURITY*|*AUDIT*|*CHIFFREMENT*|*RGPD*) area="security" ;;
    *MONOREPO*|*STRUCTURE*|*CORE*) area="core" ;;
    *BUILD*|*CI*|*PIPELINE*|*DOCKER*) area="devops" ;;
    *API*|*DATABASE*) area="api" ;;
    *BROWSER*|*STEALTH*) area="browser" ;;
    *WEB*|*FRONTEND*|*DESIGN*|*USER*) area="web" ;;
    *DOC*) area="docs" ;;
  esac
  
  if [ -n "$area" ]; then 
    labels="$labels,area:$area"
  fi

  echo "📝 Création: [$priority] $title"
  
  # Créer l'issue avec gh CLI
  gh issue create \
    --title "$title" \
    --label "$labels" \
    --body "**Release Blocker $priority**

Extrait de RELEASE-BLOCKERS-ANALYSIS.md

**Action requise**: 
- Assigner un owner
- Définir ETA
- Compléter template de réponse équipe
- Créer PR de correction

Voir: docs/templates/RELEASE-BLOCKER-ANSWER-TEMPLATE.md" \
    --assignee "@me" 2>/dev/null || echo "  ❌ Échec création (peut-être déjà existante)"
}

echo "🔴 Création P0 Blockers (critiques)..."
for blocker in "${P0_BLOCKERS[@]}"; do
  create_issue "$blocker" "P0"
done

echo ""
echo "🟡 Création P1 Blockers (majeurs)..."
for blocker in "${P1_BLOCKERS[@]}"; do
  create_issue "$blocker" "P1"
done

echo ""
echo "✅ Synchronisation terminée"
echo "📊 Total: ${#P0_BLOCKERS[@]} P0 + ${#P1_BLOCKERS[@]} P1 = $((${#P0_BLOCKERS[@]} + ${#P1_BLOCKERS[@]})) issues"
echo ""
echo "🎯 Prochaines étapes:"
echo "1. Assigner chaque issue à un owner"
echo "2. Définir ETA pour chaque blocker"
echo "3. Activer protection branche main"
echo "4. Lancer exécution plan release"