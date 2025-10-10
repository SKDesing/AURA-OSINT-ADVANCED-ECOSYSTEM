#!/usr/bin/env bash
set -euo pipefail

echo "🚨 Création des 26 release blockers principaux..."

# P0 Issues
gh issue create --title "[P0] STRUCTURE MONOREPO CASSÉE" --assignee "@me" --body "**Release Blocker P0 - CRITIQUE**
Deadline: 2025-01-12 (48h)
Action: Réorganisation selon DIRECTIVES-REORGANISATION-AURA.md
Area: Core
Owner: @KaabacheSoufiane"

gh issue create --title "[P0] BUILD PIPELINE CASSÉ" --assignee "@me" --body "**Release Blocker P0 - CRITIQUE**
Deadline: 2025-01-14 (5j)
Action: Fix complet CI/CD + tests
Area: DevOps
Owner: @KaabacheSoufiane"

gh issue create --title "[P0] CORE CONSOLIDATION" --assignee "@me" --body "**Release Blocker P0 - CRITIQUE**
Deadline: 2025-01-13 (72h)
Action: Fusion packages en @aura/core
Area: Core
Owner: @KaabacheSoufiane"

gh issue create --title "[P0] GESTION SECRETS PRODUCTION" --assignee "@me" --body "**Release Blocker P0 - CRITIQUE**
Deadline: 2025-01-16 (7j)
Action: Vault/K8s secrets management
Area: Security
Owner: @KaabacheSoufiane"

# P1 Issues critiques
gh issue create --title "[P1] STEALTH BROWSER INSTABLE" --assignee "@me" --body "**Release Blocker P1 - MAJEUR**
Deadline: 2025-02-09 (30j)
Action: Stabilisation anti-bot + proxy rotation
Area: Browser
Owner: @KaabacheSoufiane"

gh issue create --title "[P1] DOCUMENTATION UTILISATEUR 0%" --assignee "@me" --body "**Release Blocker P1 - MAJEUR**
Deadline: 2025-01-30 (21j)
Action: Manuel utilisateur + API docs
Area: Docs
Owner: @KaabacheSoufiane"

gh issue create --title "[P1] TESTS UNITAIRES 0%" --assignee "@me" --body "**Release Blocker P1 - MAJEUR**
Deadline: 2025-02-09 (30j)
Action: Suite tests complète >80% coverage
Area: DevOps
Owner: @KaabacheSoufiane"

gh issue create --title "[P1] CONFORMITÉ RGPD 0%" --assignee "@me" --body "**Release Blocker P1 - MAJEUR**
Deadline: 2025-02-23 (45j)
Action: Audit + mise en conformité RGPD
Area: Security
Owner: @KaabacheSoufiane"

gh issue create --title "[P1] MULTI-PLATFORM 25%" --assignee "@me" --body "**Release Blocker P1 - MAJEUR**
Deadline: 2025-03-09 (60j)
Action: Instagram, Facebook, Twitter adapters
Area: API
Owner: @KaabacheSoufiane"

gh issue create --title "[P1] API ENDPOINTS INSTABLES" --assignee "@me" --body "**Release Blocker P1 - MAJEUR**
Deadline: 2025-01-30 (21j)
Action: Stabilisation REST + rate limiting
Area: API
Owner: @KaabacheSoufiane"

echo "✅ 10 issues principales créées"
echo "🔗 Voir: gh issue list --assignee @me"