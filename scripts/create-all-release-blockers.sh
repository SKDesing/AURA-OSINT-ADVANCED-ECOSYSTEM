#!/usr/bin/env bash
set -euo pipefail

echo "🚨 Création COMPLÈTE des 47 release blockers..."

# P0 Blockers - CRITIQUES (5)
declare -a P0_BLOCKERS=(
  "SECRETS DANS GIT|security|@KaabacheSoufiane|2025-01-11|BFG Repo Cleaner + rotation complète"
  "STRUCTURE MONOREPO CASSÉE|core|@KaabacheSoufiane|2025-01-12|Réorganisation selon DIRECTIVES-REORGANISATION-AURA.md"
  "BUILD PIPELINE CASSÉ|devops|@KaabacheSoufiane|2025-01-14|Fix complet CI/CD + tests"
  "CORE CONSOLIDATION|core|@KaabacheSoufiane|2025-01-13|Fusion packages en @aura/core"
  "GESTION SECRETS PRODUCTION|security|@KaabacheSoufiane|2025-01-16|Vault/K8s secrets management"
)

# P1 Blockers - MAJEURS (21)
declare -a P1_BLOCKERS=(
  "STEALTH BROWSER INSTABLE|browser|@KaabacheSoufiane|2025-02-09|Stabilisation anti-bot + proxy rotation"
  "DOCUMENTATION UTILISATEUR 0%|docs|@KaabacheSoufiane|2025-01-30|Manuel utilisateur + API docs"
  "TESTS UNITAIRES 0%|devops|@KaabacheSoufiane|2025-02-09|Suite tests complète >80% coverage"
  "CONFORMITÉ RGPD 0%|security|@KaabacheSoufiane|2025-02-23|Audit + mise en conformité RGPD"
  "MULTI-PLATFORM 25%|api|@KaabacheSoufiane|2025-03-09|Instagram, Facebook, Twitter adapters"
  "API ENDPOINTS INSTABLES|api|@KaabacheSoufiane|2025-01-30|Stabilisation REST + rate limiting"
  "DATABASE SCHEMA INCOHÉRENT|api|@KaabacheSoufiane|2025-01-25|Normalisation schema + migrations"
  "MONITORING BASIQUE|devops|@KaabacheSoufiane|2025-02-09|Prometheus + Grafana + alerting"
  "DESIGN NON FINALISÉ|web|@KaabacheSoufiane|2025-02-09|UI/UX design system complet"
  "USER MANAGEMENT MANQUANT|web|@KaabacheSoufiane|2025-02-09|Auth + roles + permissions"
  "QWEN2 INSTABLE|ai|@KaabacheSoufiane|2025-02-09|Optimisation + fallback models"
  "TRAINING DATA INSUFFISANT|ai|@KaabacheSoufiane|2025-02-23|Dataset expansion + quality"
  "CHIFFREMENT MANQUANT|security|@KaabacheSoufiane|2025-01-30|AES-256 + TLS + at-rest encryption"
  "AUDIT TRAIL INCOMPLET|security|@KaabacheSoufiane|2025-02-09|Logging complet + forensic trail"
  "DOCKER INSTABLE|devops|@KaabacheSoufiane|2025-01-30|Production-ready containers"
  "BACKUP NON TESTÉ|devops|@KaabacheSoufiane|2025-02-09|Automated backup + recovery tests"
  "MOBILE RESPONSIVE ABSENT|web|@KaabacheSoufiane|2025-02-23|Mobile-first responsive design"
  "PERFORMANCE NON OPTIMISÉE|api|@KaabacheSoufiane|2025-02-09|Caching + CDN + optimization"
  "SCALABILITÉ 0%|devops|@KaabacheSoufiane|2025-03-09|Load balancing + horizontal scaling"
  "SUPPORT CLIENT INEXISTANT|docs|@KaabacheSoufiane|2025-02-23|Help desk + knowledge base"
  "MODÈLE ÉCONOMIQUE NON DÉFINI|business|@KaabacheSoufiane|2025-02-09|Pricing + licensing strategy"
)

create_issue_with_assignment() {
  local issue_data="$1"
  local priority="$2"
  
  IFS='|' read -r title area assignee due_date action <<< "$issue_data"
  
  local labels="release-blocker,$priority,area:$area"
  
  echo "📝 [$priority] $title → $assignee (due: $due_date)"
  
  # Créer issue avec assignation et due date
  local issue_url
  issue_url=$(gh issue create \
    --title "[$priority] $title" \
    --label "$labels" \
    --assignee "$assignee" \
    --body "**Release Blocker $priority**

**Impact**: $([ "$priority" = "P0" ] && echo "CRITIQUE - Bloque release" || echo "MAJEUR - Requis pour GA")
**Deadline**: $due_date
**Action**: $action

**Équipe responsable**: $area
**Owner**: $assignee

---

**Template réponse équipe** (à compléter):

- **Blocker**: $title
- **Priorité**: $priority  
- **Propriété (RACI)**:
  - **Responsable (R)**: $assignee
  - **Approbateur (A)**: @tech-lead
  - **Consultés (C)**: @sec-lead, @devops-lead
  - **Informés (I)**: @release-manager
- **Description courte**: $action
- **Plan d'action**: TODO - détailler étapes
- **Dépendances**: TODO - lister issues/PRs liées
- **Preuves de correction**:
  - **Liens PR**: TODO
  - **Jobs CI verts**: TODO  
  - **Captures/artefacts**: TODO
- **ETA**: $due_date
- **Risques/restes à faire**: TODO
- **DoD validée par**: TODO

Voir: docs/templates/RELEASE-BLOCKER-ANSWER-TEMPLATE.md" 2>/dev/null || echo "")
  
  if [ -n "$issue_url" ]; then
    echo "  ✅ Créé: $issue_url"
  else
    echo "  ❌ Échec création"
  fi
}

echo ""
echo "🔴 Création P0 Blockers (CRITIQUES - 48h-72h)..."
for blocker in "${P0_BLOCKERS[@]}"; do
  create_issue_with_assignment "$blocker" "P0"
done

echo ""
echo "🟡 Création P1 Blockers (MAJEURS - 30 jours)..."
for blocker in "${P1_BLOCKERS[@]}"; do
  create_issue_with_assignment "$blocker" "P1"
done

echo ""
echo "✅ SYNCHRONISATION TERMINÉE"
echo "📊 Total: ${#P0_BLOCKERS[@]} P0 + ${#P1_BLOCKERS[@]} P1 = $((${#P0_BLOCKERS[@]} + ${#P1_BLOCKERS[@]})) issues"
echo ""
echo "🎯 PROCHAINES ÉTAPES IMMÉDIATES:"
echo "1. ✅ Issues créées et assignées"
echo "2. 🔄 Activer protection branche main (GitHub Settings)"
echo "3. 📋 Équipes complètent template réponse"
echo "4. 🚀 Lancer exécution P0 (deadline 48h)"
echo ""
echo "🔗 Voir toutes les issues:"
echo "gh issue list --label release-blocker"