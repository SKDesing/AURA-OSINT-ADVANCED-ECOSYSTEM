#!/usr/bin/env bash
set -euo pipefail

echo "🎯 Creating GitHub Issues for 90-Day Execution Plan"

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Install with: brew install gh"
    exit 1
fi

# Create milestone for 90-day plan
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="AURA SSI Leadership (90 days)" \
  --field description="Sans pitié execution plan to dominate SSI market" \
  --field due_on="$(date -d '+90 days' -Iseconds)" || true

# J0-J30: Solidification
gh issue create \
  --title "🔧 J0-J30: AURA Browser Security Hardening" \
  --body "**Objective**: Durcissement sécurité, MAJ auto, signature, SLOs

**DoD**:
- [ ] contextIsolation + sandbox enabled
- [ ] electron-updater configured with signature
- [ ] CSP stricte implémentée
- [ ] Health monitoring opérationnel
- [ ] SLO 99.9% uptime configuré

**Timeline**: J0-J30
**Priority**: P0 - Blocking release" \
  --label "P0,security,browser" \
  --milestone "AURA SSI Leadership (90 days)"

gh issue create \
  --title "📊 J0-J30: Pipeline Benchmark 120k+/min" \
  --body "**Objective**: Générateur de charge, métriques, rapports

**DoD**:
- [ ] Script generate-load.ts opérationnel
- [ ] Bench reproductible >120k/min
- [ ] P95 < 800ms validé
- [ ] Rapport JSON + dashboard
- [ ] SLO monitoring configuré

**Timeline**: J0-J30
**Priority**: P0 - Market proof" \
  --label "P0,performance,benchmarks" \
  --milestone "AURA SSI Leadership (90 days)"

gh issue create \
  --title "🧠 J0-J30: Correlation Core v1" \
  --body "**Objective**: Modèle graphe, timeline forensique initiale

**DoD**:
- [ ] Graph database (Neo4j/Memgraph) setup
- [ ] Timeline unifiée multi-sources
- [ ] Règles corrélation déclaratives
- [ ] Anomalies statistiques (Z-score)
- [ ] API correlation endpoints

**Timeline**: J0-J30
**Priority**: P1 - Differentiation" \
  --label "P1,correlation,forensics" \
  --milestone "AURA SSI Leadership (90 days)"

# J31-J60: Différenciation
gh issue create \
  --title "🕵️ J31-J60: Multi-Platform Collectors (Compliant)" \
  --body "**Objective**: Collecteurs robustes avec cadence humaine

**DoD**:
- [ ] Emulation usage humain (think-time, diurnité)
- [ ] Partitionnement contexte par profil
- [ ] Gestion proxys résidentiels conformes
- [ ] Rate limiting intelligent
- [ ] Monitoring détection <0.5%

**Timeline**: J31-J60
**Priority**: P0 - Core capability" \
  --label "P0,collectors,stealth" \
  --milestone "AURA SSI Leadership (90 days)"

gh issue create \
  --title "📚 J31-J60: RAG Explorer v1 (PII-safe)" \
  --body "**Objective**: Contexte corrélé avec protection PII

**DoD**:
- [ ] Vector embeddings pipeline
- [ ] PII detection + pseudonymisation
- [ ] Query interface avec contexte
- [ ] Semantic search opérationnel
- [ ] Privacy-preserving retrieval

**Timeline**: J31-J60
**Priority**: P1 - Intelligence capability" \
  --label "P1,rag,privacy" \
  --milestone "AURA SSI Leadership (90 days)"

# J61-J90: Domination
gh issue create \
  --title "🛡️ J61-J90: SOC2 Type 1 Ready Package" \
  --body "**Objective**: Politiques, contrôles, evidence pack

**DoD**:
- [ ] Access Control Policy (SSO+MFA)
- [ ] Change Management Policy
- [ ] Incident Response Policy
- [ ] Evidence collection automated
- [ ] Audit readiness assessment

**Timeline**: J61-J90
**Priority**: P0 - Enterprise readiness" \
  --label "P0,compliance,soc2" \
  --milestone "AURA SSI Leadership (90 days)"

gh issue create \
  --title "🌐 J61-J90: Professional Site + Case Studies" \
  --body "**Objective**: Site/Docs pro + études de cas sanitisées

**DoD**:
- [ ] Site web professionnel
- [ ] Documentation technique complète
- [ ] 3+ études de cas anonymisées
- [ ] ROI calculator
- [ ] Demo environment public

**Timeline**: J61-J90
**Priority**: P1 - Market presence" \
  --label "P1,marketing,website" \
  --milestone "AURA SSI Leadership (90 days)"

echo "✅ GitHub issues created for 90-day execution plan"
echo "🔗 View milestone: https://github.com/$(gh repo view --json owner,name -q '.owner.login + \"/\" + .name')/milestone/1"