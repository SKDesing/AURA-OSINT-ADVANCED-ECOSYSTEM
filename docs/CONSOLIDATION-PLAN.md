# Plan de consolidation AURA OSINT ADVANCED ECOSYSTEM

**Objectif**: Nettoyer la structure du repository sans impact sur l'exécution

## 🎯 Principes

- **Zéro impact runtime**: Aucun changement de logique, imports ou scripts actifs
- **Préservation historique**: Tous les déplacements via `git mv`
- **Archivage sécurisé**: Pas de suppression, uniquement des déplacements

## 📁 Déplacements effectués

### 1. Documentation racine → `docs/`

**Audit** → `docs/audit/`
- ARCHITECTURE-MITM-COMPLETE.md
- AUDIT-*.md
- AURA_OSINT_AUDIT_2024*.md
- EMAIL-AUDIT-ULTIMATE-V2.md

**Reports** → `docs/reports/`
- CODE-ANALYSIS-REPORT.md
- CODE-REVIEW-SUMMARY.md
- FINAL-STATUS.md
- IMPLEMENTATION-COMPLETE.md
- METRIQUES-REELLES.md

**Security** → `docs/security/`
- ENCRYPTION-SUCCESS-REPORT.md
- SECURITY-FOLLOW-UP.md
- VULNERABILITY-REPORT.md

**Secured** → `docs/secured/`
- *.md.enc (fichiers chiffrés)

**Ops** → `docs/ops/`
- EXECUTION_DIRECTE_RESPONSE.md
- MIGRATION-PNPM-CHROMIUM-RESPONSE.md
- SOLUTION-TECHNIQUE-IMMEDIATE.md

**Release** → `docs/release/`
- RELEASE-BLOCKERS-*.md
- SPRINT-0-*.md
- VALIDATION-*.md

### 2. Scripts racine → `scripts/`

- check-services.sh
- decrypt-aura.sh
- TESTS-SECURITE-AUTOMATISES.sh
- migrate-to-aura-ecosystem.sh
- verification-securite.sh

### 3. Utilitaires → `scripts/tools/`

- REPORT-DIFF.js

### 4. Legacy → `archive/legacy/`

- AURA_BROWSER/ (remplacé par apps/aura-browser/)
- desktop/ (prototypes)
- Projet_Kaabache/ (ancien nom)

### 5. Infrastructure → `docs/infra/`

- infrastructure/ (documentation)

### 6. Configuration

- pnpm-workspace-new.yaml → supprimé (doublon)
- gitleaks.toml → docs/security/gitleaks.example.toml

## 🚀 Fichiers préservés à la racine

- README.md
- LICENSE
- SECURITY.md
- CONTRIBUTING.md
- CHANGELOG.md
- package.json
- pnpm-workspace.yaml
- .gitleaks.toml

## 🔧 Code inchangé

- backend/
- server.js
- apps/aura-browser/
- clients/
- ai/
- engines/
- live-tracker/

## ✅ Résultat

Structure clarifiée sans impact sur l'exécution. Tous les services, scripts actifs et configurations opérationnelles restent inchangés.