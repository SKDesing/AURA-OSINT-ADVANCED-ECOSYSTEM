#!/bin/bash
# Script pour créer les issues critiques GA via GitHub CLI

set -e

REPO="SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM"
MILESTONE="GA-Ready"

echo "🔒 Création des issues Checkup Sans Pitié..."

# REPO-001: Description & README
gh issue create \
  --title "[CHECKUP] Description & README Modernisation" \
  --body "## 🎯 Objectif
Moderniser description GitHub et README pour préparation commerciale

## 📋 Definition of Done
- [ ] Description GitHub: 'Professional OSINT Platform for Advanced Intelligence Gathering'
- [ ] README badges: Build, CodeQL, SBOM, Release, Bench
- [ ] Sections: Quick Start, Architecture, Performance, Security, Compliance
- [ ] Screenshots: Dashboard, Router Decisions, Artifacts
- [ ] Métriques: P50/P95/P99, accuracy, bypass rate

## ⏰ Deadline: 24h
## 🚨 Bloquant GA: OUI" \
  --label "priority:critical,type:checkup,milestone:ga" \
  --assignee "@me"

# REPO-002: Required Status Checks
gh issue create \
  --title "[CHECKUP] Required Status Checks" \
  --body "## 🎯 Objectif
Activer les contrôles obligatoires pour sécuriser main

## 📋 Definition of Done
- [ ] Branch protection: main
- [ ] Required checks: bench, gitleaks, dependency-review, analyze, sbom
- [ ] Dismiss stale reviews: enabled
- [ ] Require up-to-date branches: enabled
- [ ] Admin enforcement: enabled

## ⏰ Deadline: 12h
## 🚨 Bloquant GA: OUI" \
  --label "priority:critical,type:checkup,milestone:ga"

# REPO-003: CODEOWNERS
gh issue create \
  --title "[CHECKUP] CODEOWNERS & Governance" \
  --body "## 🎯 Objectif
Établir gouvernance code avec CODEOWNERS

## 📋 Definition of Done
- [ ] CODEOWNERS: équipes par domaine (AI, Security, Frontend, Backend, Infra)
- [ ] Required reviewers: 2 minimum
- [ ] Auto-assignment: par path patterns
- [ ] Escalation rules: 24h timeout

## ⏰ Deadline: 6h
## 🚨 Bloquant GA: OUI" \
  --label "priority:critical,type:checkup,milestone:ga"

# REPO-005: Dependabot
gh issue create \
  --title "[CHECKUP] Dependabot Security" \
  --body "## 🎯 Objectif
Activer Dependabot pour sécurité automatisée

## 📋 Definition of Done
- [ ] .github/dependabot.yml: npm + GitHub Actions
- [ ] Auto-merge: patch versions
- [ ] Security updates: immediate
- [ ] Grouping: par ecosystem
- [ ] Schedule: weekly

## ⏰ Deadline: 6h
## 🚨 Bloquant GA: OUI" \
  --label "priority:critical,type:checkup,milestone:ga"

# IA-006: Dataset Extension
gh issue create \
  --title "[CHECKUP] Dataset Extension 200 échantillons" \
  --body "## 🎯 Objectif
Étendre dataset router à 200 échantillons pour stabilité

## 📋 Definition of Done
- [ ] 200 échantillons (vs 100 actuels)
- [ ] 15+ langues (vs 12 actuelles)
- [ ] 8+ plateformes (TW/IG/TT/FB/LI/YT/TG/DC)
- [ ] Catégories: bypass, osint, compliance, security, ml, api, viz, arch, test
- [ ] Validation: accuracy ≥92%, bypass ≥75%

## ⏰ Deadline: 72h
## 🚨 Bloquant GA: OUI" \
  --label "priority:critical,type:ai,milestone:ga"

# IA-007: Page Proofs
gh issue create \
  --title "[CHECKUP] Page Proofs Publique" \
  --body "## 🎯 Objectif
Créer page publique avec preuves de performance

## 📋 Definition of Done
- [ ] Route: /proofs
- [ ] Métriques temps réel: P50/P95/P99, accuracy, bypass
- [ ] Artefacts nightly: rapports JSON, graphiques
- [ ] Comparaison concurrents: benchmarks publics
- [ ] Auto-refresh: 5min

## ⏰ Deadline: 48h
## 🚨 Bloquant GA: OUI" \
  --label "priority:critical,type:frontend,milestone:ga"

echo "✅ Issues créées avec succès!"
echo "📊 Vérifiez: https://github.com/$REPO/issues"