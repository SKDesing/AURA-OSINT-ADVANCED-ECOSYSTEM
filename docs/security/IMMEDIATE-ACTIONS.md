# AURA – Actions sécurité immédiates

## Retrait dépôt (URGENT)
- **Retirer du Git**: `node_modules/`, `dist/`, `reports/*` bruts, `.env*`, `.env.production`, `.env.embeddings`
- **Ignorer via .gitignore**; purge historique avec BFG si secrets déjà poussés
- **Rotation clés** si .env exposés

## Gestion paquets
- **Choisir pnpm** (présence pnpm-workspace.yaml)
- **Supprimer** `package-lock.json`
- **Verrouiller** pnpm version dans `.nvmrc`

## CI Sécurité (gates bloquants)
- **gitleaks** (secrets)
- **syft SBOM** + license check
- **osv-scanner/npmaudit** (fail on critical)
- **semgrep** (rules JS/TS/Nest)

## Branch protection
- **Require status checks** on main
- **Commits signés**, 2FA obligatoire
- **Review required** pour merge

## Observabilité sécurité
- **Log**: X-Request-ID, user, endpoint, latency
- **Bannir PII** dans logs
- **Policies guardrails** hashées
- **Decision/context hash** propagés

## Actions immédiates (J1)
```bash
# 1. Nettoyer le dépôt
git rm -r --cached node_modules/ dist/ reports/*.md
git rm --cached .env* || true

# 2. Unifier gestionnaire
rm package-lock.json
pnpm install

# 3. Commit nettoyage
git add .gitignore
git commit -m "security: remove artifacts and secrets from git"
```

## Validation
- [ ] Aucun secret dans `git log --oneline --name-only`
- [ ] Un seul lockfile (pnpm-lock.yaml)
- [ ] CI gates actifs sur main