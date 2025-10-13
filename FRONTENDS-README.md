# 📱 FRONTENDS AURA OSINT - Organisation

## ✅ Frontends à GARDER

### 1. **clients/web/** (505MB) - Application Principale
**Rôle** : Dashboard OSINT complet avec vraie IA
- Frontend React connecté au backend
- Utilise la vraie IA Qwen pour investigations
- Sera déployé sur le cloud (production)
- Port : 3000
- URL future : https://app.aura-osint.com

**Utilisation** :
```bash
cd clients/web/frontend
npm install
npm start
```

### 2. **marketing/sites/vitrine-aura-advanced-osint-ecosystem/** (892MB) - Site Vitrine
**Rôle** : Site de présentation avec IA factice (démo)
- Présentation du projet AURA OSINT
- IA factice avec données mockées (pour démo)
- Showcase des fonctionnalités
- Port : 5173
- URL future : https://aura-osint.com

**Utilisation** :
```bash
cd marketing/sites/vitrine-aura-advanced-osint-ecosystem
npm install
npm run dev
```

## ❌ Frontend à SUPPRIMER

### 3. **frontend/** (660KB) - DOUBLON
**Raison** : Doublon avec clients/web/
- Ancien frontend simple HTML/JS
- Remplacé par clients/web/
- Peut être supprimé sans risque

## 🎯 Architecture Finale

```
AURA-OSINT-ADVANCED-ECOSYSTEM/
├── backend/                    ← API Backend (port 4011)
│   └── server.js
├── clients/
│   └── web/                    ← ✅ App principale (port 3000)
│       └── frontend/           → Vraie IA + Backend
└── marketing/
    └── sites/
        └── vitrine-*/          ← ✅ Site vitrine (port 5173)
                                → IA factice + Démo
```

## 🚀 Déploiement

**Production** :
- Backend : AWS/Azure (port 4011)
- App principale : Vercel/Netlify (clients/web/)
- Site vitrine : Vercel/Netlify (marketing/sites/vitrine/)

**Domaines** :
- https://aura-osint.com → Site vitrine (marketing)
- https://app.aura-osint.com → Application (clients/web)
- https://api.aura-osint.com → Backend API

## 📊 Différences

| Aspect | clients/web/ | marketing/vitrine/ |
|--------|--------------|-------------------|
| **Rôle** | App production | Site démo |
| **IA** | Vraie (Qwen) | Factice (mock) |
| **Backend** | Connecté | Standalone |
| **Données** | Réelles | Mockées |
| **Public** | Utilisateurs | Visiteurs |
| **Auth** | Requise | Publique |

## ✅ Action Recommandée

Supprimer `frontend/` (doublon) :
```bash
rm -rf frontend/
git add -A
git commit -m "🔥 Remove: frontend/ (doublon avec clients/web/)"
```

**Gain** : -660KB + clarté
