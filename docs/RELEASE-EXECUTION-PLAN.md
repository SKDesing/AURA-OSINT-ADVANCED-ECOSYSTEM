# Release Execution Plan — "Sans pitié"

**Objectif**: Transformer COMMERCIALISATION-CHECKLIST-COMPLETE.md et RELEASE-BLOCKERS-ANALYSIS.md en plan exécutable avec issues, owners, due dates et gates CI bloquants.

## Rôles
- **Release Manager (RM)**: coordination, jalons, arbitrages
- **Tech Lead Core**: consolidation @aura/core
- **Sec Lead**: secrets, BFG, gitleaks, rotations
- **DevOps Lead**: CI/CD, infra, build, images
- **QA Lead**: plans de tests, couverture, E2E/charge
- **Legal/Privacy**: RGPD, DPA, DPIA, ToS/Privacy Policy

## Jalons
- **T0 + 24h**: P0 "assignés/ETA" + CI "release-readiness" active
- **T0 + 72h**: Core consolidation Phase 1 exécutée (moves + imports)
- **T0 + 5j**: CI verte (lint/typecheck/test/build/gitleaks/db-validate/core-verify)
- **T0 + 14j**: P0 clos, P1 en cours
- **T0 + 45j**: RGPD minimum viable validé
- **T0 + 90j**: Release Candidate

## Definition of Done (Go-Live)
- 0 blocker P0 ouverts, P1 <= 3 avec contournements validés
- CI "release-readiness" 100% verte sur main
- Sécurité: gitleaks OK, BFG effectué + rotation secrets
- Docs: utilisateur + API + déploiement + légal à jour
- Support: monitoring/alerting + runbooks + SLA prêts

## Processus
1. Synchroniser les 47 blockers en issues GitHub (labels P0/P1, release-blocker, area:*)
2. Exiger de CHAQUE équipe une réponse structurée (template ci-joint) par blocker: owner, ETA, PR, preuves
3. Activer le workflow CI "release-readiness" (bloquant)
4. Hebdo: revue RM avec statut, risques, décisions d'arbitrage