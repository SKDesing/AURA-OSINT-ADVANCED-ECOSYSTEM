# 📦 RAPPORT - DÉPENDANCES ET SÉCURITÉ

## PROBLÈMES
1. Dépendances obsolètes (npm outdated, pip list --outdated)
2. Dépendances inutilisées (depcheck)
3. Conflits de versions (jsonpickle, pillow)
4. Pas de lockfiles gérés (package-lock.json gitignored!)
5. Vulnérabilités connues (npm audit, snyk)

## ACTIONS
- npm audit fix
- pip-audit
- Versionner package-lock.json
- Activer Dependabot GitHub
