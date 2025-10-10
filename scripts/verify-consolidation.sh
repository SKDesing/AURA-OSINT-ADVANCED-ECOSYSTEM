#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Vérification consolidation (références cassées potentielles)"
fail=0

# 1) Aucune référence active aux anciens répertoires (hors archive/legacy)
if git grep -nE '(AURA_BROWSER/|desktop/|Projet_Kaabache/)' -- . ':!archive/legacy/**' > /tmp/aura_refs_legacy.txt 2>/dev/null; then
  echo "⚠️ Références vers legacy détectées:"
  cat /tmp/aura_refs_legacy.txt
  fail=1
else
  echo "✅ Pas de références actives vers legacy"
fi

# 2) Aucune référence à 'infrastructure/' hors docs/infra/infrastructure
if git grep -nE '(^|[^a-zA-Z])infrastructure/' -- . ':!docs/infra/infrastructure/**' > /tmp/aura_refs_infra.txt 2>/dev/null; then
  echo "⚠️ Références à infrastructure/ détectées:"
  cat /tmp/aura_refs_infra.txt
  fail=1
else
  echo "✅ Pas de références actives vers infrastructure/"
fi

# 3) Scripts déplacés: vérifier appels aux anciens chemins
patterns='check-services\.sh|decrypt-aura\.sh|migration-repo-securise\.sh|migrate-to-aura-ecosystem\.sh|update-aura-references\.sh|upgrade-icons-design\.sh|verification-securite\.sh|REPORT-DIFF\.js'
if git grep -nE "($patterns)" . 2>/dev/null | grep -v '^scripts/' > /tmp/aura_refs_scripts.txt; then
  echo "⚠️ Fichiers référencés par anciens chemins:"
  cat /tmp/aura_refs_scripts.txt
  fail=1
else
  echo "✅ Pas de références aux anciens chemins de scripts"
fi

# 4) Workflows: pas d'anciens chemins
if [ -d .github/workflows ]; then
  if git grep -nE '(AURA_BROWSER/|desktop/|Projet_Kaabache/|infrastructure/|REPORT-DIFF\.js)' .github/workflows > /tmp/aura_refs_ci.txt 2>/dev/null; then
    echo "⚠️ Workflows référencent des anciens chemins:"
    cat /tmp/aura_refs_ci.txt
    fail=1
  else
    echo "✅ Workflows OK"
  fi
fi

# Nettoyage
rm -f /tmp/aura_refs_*.txt

# Résultat
if [ "$fail" -eq 0 ]; then
  echo "🎯 Vérification consolidation: OK"
else
  echo "❗ Vérification consolidation: anomalies détectées"
  exit 1
fi