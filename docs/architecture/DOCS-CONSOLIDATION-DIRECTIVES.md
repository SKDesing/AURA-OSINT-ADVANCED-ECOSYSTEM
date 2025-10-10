# Directives de consolidation des documents Markdown

## Objectif
- Réduire drastiquement le nombre de fichiers .md en créant une poignée de documents de référence par domaine (architecture, audits, migration, release, roadmap, marketing, rapports).
- Conserver la traçabilité: chaque doc consolidé liste les sources et leurs derniers commits (provenance).
- Déplacer les originaux en archive après validation humaine.

## Règles
- 1 domaine = 1 document "source of truth":
  - Architecture → docs/architecture/AURA-ARCHITECTURE.md
  - Audits → docs/audits/SECURITY-AUDITS-2024.md
  - Migration & Nettoyage → docs/migration/REORG-MIGRATION-LOG.md
  - Release readiness → docs/release/RELEASE-PLAN.md
  - Roadmap → docs/roadmap/ROADMAP.md
  - Rapports techniques → docs/reports/TECHNICAL-REPORTS.md
  - Marketing/Exécutif → docs/marketing/EXECUTIVE-SUMMARY.md
- Fichiers .enc et sensibles restent en docs/sensitive/ intacts (pas de fusion).
- Les docs "README" spécifiques à une app restent avec l'app (ex: apps/desktop/README.md), pas fusionnés globalement.

## Processus
1) Renseigner docs/_meta/md-consolidation-map.yml avec toutes les sources → cible.
2) Lancer scripts/docs/execute-md-consolidation.sh en dry-run pour générer les docs consolidés sous docs/_build/.
3) Revue humaine: vérifier sections, titres, doublons, et réécrire si nécessaire.
4) En "apply": déposer les consolidés à leur destination (docs/architecture/…, docs/audits/…) et déplacer les sources vers docs/archive/ avec un index.
5) Ouvrir une PR "docs(consolidation): fusion .md par domaine + archives".

## Exclusions (ne pas fusionner)
- *.md.enc (AURA-SECURITY-CHECKLIST.md.enc, MITM-STEALTH-ARCHITECTURE.md.enc, PROJECT-TITAN-ACTIVATED.md.enc, REVOLUTION-ANALYSIS-TITAN.md.enc, etc.)
- SECURITY.md (politique standard) reste tel quel, mais référencé dans le doc sécurité si besoin.
- CHANGELOG.md reste autonome.

## Checklist de validation
- Chaque doc consolidé comporte:
  - Un titre clair + table des matières.
  - Une "Provenance" listant toutes les sources fusionnées avec liens GitHub + dernier commit.
  - Des sections regroupant et dédupliquant l'info (pas juste une concat brutale).
- Aucun secret ni URL de secrets visibles.
- Les originaux sont soit supprimés, soit déplacés en docs/archive/ avec un index.
- Liens internes (anchors) réparés.

## Commande type
- Dry run: bash scripts/docs/execute-md-consolidation.sh --dry-run
- Apply: bash scripts/docs/execute-md-consolidation.sh --apply