#!/usr/bin/env bash
set -euo pipefail

# Prérequis:
# - gh CLI authentifié (gh auth login)
# - Repo courant configuré (gh repo set-default)
DOC="RELEASE-BLOCKERS-ANALYSIS.md"

if [ ! -f "$DOC" ]; then
  echo "Document $DOC introuvable"; exit 1
fi

# Parse les sections P0/P1 du document
parse_blockers() {
  local priority="$1"
  # Extraire les titres complets des blockers
  grep -E "^### [0-9]+\. 🚨 \*\*.*\*\* - $priority" "$DOC" | \
  sed -E "s/^### [0-9]+\. 🚨 \*\*(.*)\*\* - $priority.*/\1/" | \
  sed 's/ CRITIQUE$//' | sed 's/ MAJEUR$//' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//'
}

create_or_update_issue() {
  local title="$1"
  local priority="$2"
  local labels="release-blocker,$priority"
  
  # Déterminer l'area depuis le titre
  local area=""
  case "$title" in
    *SECRETS*|*SECURITY*|*AUDIT*) area="security" ;;
    *MONOREPO*|*STRUCTURE*|*CORE*) area="core" ;;
    *BUILD*|*CI*|*PIPELINE*) area="devops" ;;
    *API*) area="api" ;;
    *BROWSER*) area="browser" ;;
    *WEB*|*FRONTEND*) area="web" ;;
    *RGPD*) area="rgpd" ;;
  esac
  
  if [ -n "$area" ]; then 
    labels="$labels,area:$area"
  fi

  # Chercher issue existante
  local existing
  existing=$(gh issue list --search "$title in:title" --state all --json number,title -q ".[] | select(.title==\"$title\") | .number" 2>/dev/null || true)
  
  if [ -n "$existing" ]; then
    echo "MAJ issue #$existing: $title"
    gh issue edit "$existing" --add-label "$labels" >/dev/null 2>&1 || true
  else
    echo "Création issue: $title"
    gh issue create --title "$title" --label "$labels" --body "Auto-créé depuis $DOC. Veuillez compléter le template de réponse d'équipe." >/dev/null 2>&1 || true
  fi
}

echo "🔍 Synchronisation des release blockers..."

# P0 Blockers
echo "📍 P0 Blockers:"
for blocker in $(parse_blockers "P0"); do
  echo "  - $blocker"
  create_or_update_issue "$blocker" "P0"
done

# P1 Blockers  
echo "📍 P1 Blockers:"
for blocker in $(parse_blockers "P1"); do
  echo "  - $blocker"
  create_or_update_issue "$blocker" "P1"
done

echo "✅ Issues synchronisées"