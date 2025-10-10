# Plan de tests complet AURA OSINT

## Objectifs
Assurer la qualité fonctionnelle et non-fonctionnelle (sécurité, perf, résilience, a11y) avant le grand run.

## Pyramide et budgets
- **Unitaires**: 70% des cas, Couverture globale >= 85%, modules critiques >= 90%
- **Intégration**: 20% (DB, Redis, Docker containers)
- **E2E**: 10% (Playwright sur flows OSINT critiques)
- **Mutation testing** sur modules critiques (score cible: >= 60%)

## Portée AURA OSINT
- **API Backend**: endpoints OSINT, validation, jobs BullMQ, résultats DB
- **Frontend React**: UI tools, flows investigation, export CSV/JSON
- **Workers**: Amass, Subfinder, PhoneInfoga, parsing résultats
- **Données**: migrations PostgreSQL, seed OSINT, anonymisation

## Stratégie
1. **Unitaires** (Vitest backend + RTL frontend)
2. **Intégration** (Testcontainers: Postgres, Redis, Docker OSINT tools)
3. **Contract tests** (Pact: React ↔ Backend API)
4. **E2E** (Playwright: job OSINT complet, export résultats)
5. **Perf** (k6: API endpoints, budgets Lighthouse)
6. **A11y** (axe: interface OSINT accessible)
7. **Sécurité** (audits, headers, rate-limit, sandbox Docker)

## Flows critiques à tester
- ✅ Lancement job Amass → résultats subdomains
- ✅ Export CSV/JSON des résultats
- ✅ Interface accessible (keyboard nav, screen readers)
- ✅ Rate limiting API OSINT
- ✅ Gestion erreurs Docker/tools

## Sorties attendues
- Rapports JUnit + Coverage HTML/LCOV
- Captures E2E/videos Playwright
- Rapports Lighthouse (perf + a11y)
- Pact contracts validés
- FINAL-STATUS.md mis à jour