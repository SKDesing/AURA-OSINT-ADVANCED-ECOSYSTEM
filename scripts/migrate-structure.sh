#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Consolidation structure AURA OSINT (zéro impact runtime)"

# 0) Préparation
mkdir -p docs/{audit,release,reports,security,ops,infra,frontend,desktop,business,communication,roadmap,directives,secured}
mkdir -p scripts/tools
mkdir -p archive/legacy

# 1) Workspace doublon
[ -f pnpm-workspace-new.yaml ] && git rm pnpm-workspace-new.yaml || true

# 2) Gitleaks
[ -f gitleaks.toml ] && git mv gitleaks.toml docs/security/gitleaks.example.toml || true

# 3) Scripts -> scripts/
for f in check-services.sh decrypt-aura.sh TESTS-SECURITE-AUTOMATISES.sh migrate-to-aura-ecosystem.sh migration-repo-securise.sh update-aura-references.sh upgrade-icons-design.sh verification-securite.sh; do
  [ -f "$f" ] && git mv "$f" "scripts/$f" || true
done

# 4) Utilitaires Node -> scripts/tools/
[ -f REPORT-DIFF.js ] && git mv REPORT-DIFF.js scripts/tools/REPORT-DIFF.js || true

# 5) Legacy -> archive/legacy/
for d in AURA_BROWSER desktop Projet_Kaabache; do
  [ -d "$d" ] && git mv "$d" "archive/legacy/$d" || true
done

# 6) Infra documentaire -> docs/infra
[ -d infrastructure ] && git mv infrastructure docs/infra/infrastructure || true

# 7) Docs racine -> docs/ (fonction helper)
move_doc() {
  src="$1"; dest="$2"; [ -f "$src" ] && git mv "$src" "$dest" || true
}

# Audit
for f in ARCHITECTURE-MITM-COMPLETE.md AUDIT-*.md AURA_OSINT_AUDIT_2024*.md EMAIL-AUDIT-ULTIMATE-V2.md; do
  move_doc "$f" "docs/audit/$f"
done

# Reports
for f in CI-CD-HOTFIX-REPORT.md CODE-ANALYSIS-REPORT.md CODE-REVIEW-SUMMARY.md FINAL-STATUS.md IMPLEMENTATION-COMPLETE.md METRIQUES-REELLES.md NETTOYAGE-SUCCESS-REPORT.md POST-REORGANIZATION-SUCCESS.md RAPPORT-TECHNIQUE-FINAL-RESPONSE.md; do
  move_doc "$f" "docs/reports/$f"
done

# Security
for f in ENCRYPTION-SUCCESS-REPORT.md SECURITY-FOLLOW-UP.md VULNERABILITY-REPORT.md; do
  move_doc "$f" "docs/security/$f"
done
for f in AURA-SECURITY-CHECKLIST.md.enc MITM-STEALTH-ARCHITECTURE.md.enc PROJECT-TITAN-ACTIVATED.md.enc REVOLUTION-ANALYSIS-TITAN.md.enc; do
  move_doc "$f" "docs/secured/$f"
done

# Ops
for f in EXECUTION_DIRECTE_RESPONSE.md MIGRATION-PNPM-CHROMIUM-RESPONSE.md NETTOYAGE-READY-EXECUTION.md PUSH-SOLUTION.md SOLUTION-TECHNIQUE-IMMEDIATE.md SOLUTION-EMAIL-FINALE.md; do
  move_doc "$f" "docs/ops/$f"
done

# Release
for f in RELEASE-BLOCKERS-ANALYSIS.md RELEASE-BLOCKERS-STATUS.md RENAME-COMPLETE.md REORGANISATION-COMPLETE.md SPRINT-0-EMERGENCY.md SPRINT-0-SUCCESS-REPORT.md VALIDATION-EQUIPES-REQUISE.md VALIDATION-FINALE-EQUIPES.md; do
  move_doc "$f" "docs/release/$f"
done

# Autres catégories
move_doc AURA-BROWSER-EXECUTIVE-SUMMARY.md docs/desktop/AURA-BROWSER-EXECUTIVE-SUMMARY.md
move_doc ROADMAP-DESKTOP.md docs/desktop/ROADMAP-DESKTOP.md
move_doc AURA-FRONT-ARCHITECTURE.md docs/frontend/AURA-FRONT-ARCHITECTURE.md
move_doc COMMERCIALISATION-CHECKLIST-COMPLETE.md docs/business/COMMERCIALISATION-CHECKLIST-COMPLETE.md
move_doc PRESENTATION-ACADEMIQUE-FINALE.md docs/communication/PRESENTATION-ACADEMIQUE-FINALE.md
move_doc EXPANSION-ROADMAP.md docs/roadmap/EXPANSION-ROADMAP.md
move_doc DIRECTIVES-REORGANISATION-AURA.md docs/directives/DIRECTIVES-REORGANISATION-AURA.md

echo "✅ Consolidation terminée. Exécutez: git commit -m 'chore(repo): consolidate docs/scripts and archive legacy (no runtime changes)'"