# AURA – Politique des ports et exploitation

## Objectifs
- Zéro conflit de ports en dev et en prod locale
- Un seul fichier source de vérité (config/ports.manifest.json)
- Outils d'inventaire (code + processus OS) et correction assistée

## Plages réservées
- **3000–3099**: Front web dev (Next.js: 3000, Vite alt: 5173, Web React AURA: 54112)
- **4000–4099**: API Gateway / Backends
  - 4001: ai-gateway (NestJS)
  - 4010: backend-mvp (REST + SSE)
  - 4011: artifacts-service (si séparé)
- **Systèmes externes** (non gérés par AURA)
  - 5432: PostgreSQL
  - 6379: Redis

## Règles
- Tous les services lisent leur port depuis l'env PORT (ou équivalent Vite/Next)
- Les scripts vérifient la disponibilité du port et échouent proprement avec guidance
- Un seul serveur par port; si occupé → proposer le prochain port libre dans la plage

## Procédure opérateur (dev)
- **Inventaire**: `node scripts/dev/port-inventory.js`
- **Correction appliquée**: `node scripts/dev/port-fix.js --apply`
- **Libérer un port**: `scripts/dev/kill-port.sh <port>`

## Notes
- Les manifestes priment sur tout hardcode. Si un conflit persiste, corriger le code incriminé pour ~process.env.PORT.

## Architecture des ports

```
┌─────────────────────────────────────────────────────────────┐
│                    AURA Port Architecture                   │
├─────────────────────────────────────────────────────────────┤
│ Frontend (54112)                                            │
│   ├── React Dev Server (Vite)                              │
│   └── SSE Client → Backend (4010)                          │
├─────────────────────────────────────────────────────────────┤
│ Backend Services                                            │
│   ├── MVP Backend (4010) - REST + SSE                      │
│   ├── AI Gateway (4001) - NestJS                           │
│   └── Artifacts Service (4011) - Optional                  │
├─────────────────────────────────────────────────────────────┤
│ External Services                                           │
│   ├── PostgreSQL (5432)                                    │
│   └── Redis (6379) - Optional                              │
└─────────────────────────────────────────────────────────────┘
```

## Flux de données
1. **Frontend (54112)** → **Backend MVP (4010)** pour API REST
2. **Frontend (54112)** → **Backend MVP (4010)** pour SSE metrics
3. **Backend MVP (4010)** → **AI Gateway (4001)** pour routes IA
4. **Services** → **PostgreSQL (5432)** pour persistance
5. **Services** → **Redis (6379)** pour cache (optionnel)