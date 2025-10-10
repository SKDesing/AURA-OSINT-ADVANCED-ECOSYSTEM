# Mode d'exploitation: AURA Browser Only

## Objectif
Tous les services AURA doivent démarrer uniquement via l'application Electron "AURA OSINT ADVANCED ECOSYSTEM".

## Décisions
- **Entrée unique**: Electron (apps/aura-browser)
- **Orchestration**:
  - **DEV**: Electron spawn backend (4011) et front CRA (3000), puis ouvre la fenêtre
  - **PROD**: Electron charge le build React packagé et spawn le backend
- **Enforcement backend**: refus de démarrer si non lancé par Electron (ELECTRON_LAUNCH=1)
- **Réseau**: 127.0.0.1 uniquement pour tous services; pas d'exposition publique

## Commandes
- **DEV**: `pnpm run dev` (ouvre Electron, lance backend+web)
- **BUILD PROD**: `pnpm run build:ui && pnpm run build:browser`

## Interdits
- Lancer `react-scripts start` ou le backend en direct en dehors d'Electron (bloqué si AURA_BROWSER_ONLY≠0)
- `start:chromium-ui` est déprécié

## Variables
- `AURA_BROWSER_ONLY=1` (par défaut, enforcement actif)
- `ELECTRON_LAUNCH=1` (ajouté automatiquement par Electron au backend)