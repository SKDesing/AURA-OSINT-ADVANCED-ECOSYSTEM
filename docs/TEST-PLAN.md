# Plan de tests AURA OSINT (stabilisé)

## Architecture des tests

- **Vitest** pour unitaires/intégration (Node/AI)
- **Playwright** pour E2E (frontend)
- **Frontend** (CRA) exclu de Vitest, tests gérés par Playwright
- **Exclusions Vitest**: clients/**, marketing/**, tests/e2e/**, node_modules/**
- **Stubs fournis** pour modules manquants (harassment-detector, AntiHarassmentEngine, config)

## Commandes

```bash
# Tests unitaires/intégration
pnpm run test:unit

# Tests E2E (nécessite services démarrés)
pnpm run test:e2e

# Tous les tests (séquentiel)
pnpm run test:all

# Interface Playwright
pnpm run test:e2e:ui
```

## État actuel

✅ **Tests router**: 8/8 passent  
✅ **Tests backend**: 2/2 passent  
✅ **Isolation Vitest/Playwright**: Configurée  
✅ **Mock Sharp**: Implémenté  
✅ **Stubs modules**: Créés  

## Prochaines étapes

- Finaliser stubs tests intégration
- Configurer E2E avec services
- Ajouter tests OSINT spécifiques