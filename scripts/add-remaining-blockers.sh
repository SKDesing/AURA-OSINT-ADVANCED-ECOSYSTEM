#!/usr/bin/env bash
set -euo pipefail

echo "🚨 Ajout des 16 release blockers restants..."

# P1 Issues restantes
gh issue create --title "[P1] DATABASE SCHEMA INCOHÉRENT" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-01-25
Action: Normalisation schema + migrations
Area: API"

gh issue create --title "[P1] MONITORING BASIQUE" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Prometheus + Grafana + alerting
Area: DevOps"

gh issue create --title "[P1] DESIGN NON FINALISÉ" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: UI/UX design system complet
Area: Web"

gh issue create --title "[P1] USER MANAGEMENT MANQUANT" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Auth + roles + permissions
Area: Web"

gh issue create --title "[P1] QWEN2 INSTABLE" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Optimisation + fallback models
Area: AI"

gh issue create --title "[P1] TRAINING DATA INSUFFISANT" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-23
Action: Dataset expansion + quality
Area: AI"

gh issue create --title "[P1] CHIFFREMENT MANQUANT" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-01-30
Action: AES-256 + TLS + at-rest encryption
Area: Security"

gh issue create --title "[P1] AUDIT TRAIL INCOMPLET" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Logging complet + forensic trail
Area: Security"

gh issue create --title "[P1] DOCKER INSTABLE" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-01-30
Action: Production-ready containers
Area: DevOps"

gh issue create --title "[P1] BACKUP NON TESTÉ" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Automated backup + recovery tests
Area: DevOps"

gh issue create --title "[P1] MOBILE RESPONSIVE ABSENT" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-23
Action: Mobile-first responsive design
Area: Web"

gh issue create --title "[P1] PERFORMANCE NON OPTIMISÉE" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Caching + CDN + optimization
Area: API"

gh issue create --title "[P1] SCALABILITÉ 0%" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-03-09
Action: Load balancing + horizontal scaling
Area: DevOps"

gh issue create --title "[P1] SUPPORT CLIENT INEXISTANT" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-23
Action: Help desk + knowledge base
Area: Docs"

gh issue create --title "[P1] MODÈLE ÉCONOMIQUE NON DÉFINI" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-09
Action: Pricing + licensing strategy
Area: Business"

gh issue create --title "[P1] PACKAGING DISTRIBUTION" --assignee "@me" --body "**Release Blocker P1**
Deadline: 2025-02-23
Action: Installateurs + marketplace
Area: DevOps"

echo "✅ 16 issues supplémentaires créées"
echo "📊 Total: 5 P0 + 21 P1 = 26 release blockers"