# 📁 AURA - Structure de Projet Organisée

## 🗂️ Architecture Finale

```
AURA-OSINT-ADVANCED-ECOSYSTEM/
├── 📊 database/
│   ├── schemas/                    # Schémas SQL
│   │   ├── schema-aura-users.sql
│   │   ├── schema-aura-forensic-complet.sql
│   │   └── schema-aura-system.sql
│   └── migrations/                 # Migrations futures
│
├── 🎨 frontend/
│   ├── components/                 # Composants React
│   │   └── AdminDashboard.jsx
│   ├── pages/                      # Pages HTML
│   │   ├── admin.html
│   │   ├── index.html
│   │   ├── startup-wizard.html
│   │   └── questionnaire-cli.html
│   └── assets/                     # CSS, images, etc.
│
├── ⚙️ backend/
│   ├── api/                        # APIs REST
│   │   └── admin-dashboard.js
│   ├── services/                   # Services métier
│   │   └── correlation-engine-complete.js
│   └── config/                     # Configurations
│
├── 📚 docs/
│   ├── guides/                     # Documentation
│   └── reports/                    # Rapports générés
│
├── 🔧 scripts/
│   ├── setup/                      # Scripts d'installation
│   │   └── setup-databases.sh
│   └── deployment/                 # Scripts de déploiement
│
├── 🏠 Racine/
│   ├── gui-launcher.js             # Lanceur principal
│   ├── analytics-api.js            # API analytics (à déplacer)
│   ├── package.json
│   └── README.md
│
└── 🗑️ temp/                        # Fichiers temporaires
```

## 🧹 Nettoyage Effectué

### ❌ Supprimé
- `aura-landing-page_backup_*` (4 dossiers de backup)
- `backup_brave_migration_*` (1 dossier de backup)
- `AURA-OSINT-ADVANCED-ECOSYSTEM-USB/` (dossier dupliqué)
- `frontend-build/` (dossier dupliqué)
- `launcher-interface/` (dossier dupliqué)
- `views/` (fichiers EJS inutiles)
- `src/` (structure React mal placée)

### ✅ Réorganisé
- **Schémas DB** → `database/schemas/`
- **Scripts setup** → `scripts/setup/`
- **APIs** → `backend/api/`
- **Services** → `backend/services/`
- **Pages HTML** → `frontend/pages/`
- **Composants React** → `frontend/components/`

## 🔄 Fichiers à Migrer (Prochaine étape)

### À déplacer vers `backend/api/`
- `analytics-api.js`
- `service-orchestrator.js`

### À déplacer vers `backend/services/`
- `chromium-launcher.js`
- `security-manager.js`

### À déplacer vers `scripts/setup/`
- `quick-start.js`
- `chromium-only-enforcer.js`

## 🎯 Avantages de cette Structure

1. **Séparation claire** : Frontend/Backend/Database
2. **Maintenance facile** : Chaque type de fichier à sa place
3. **Scalabilité** : Structure prête pour l'expansion
4. **Standards** : Suit les conventions modernes
5. **Collaboration** : Équipes peuvent travailler séparément

## 🚀 Prochaines Actions

1. Terminer la migration des fichiers restants
2. Mettre à jour les imports/requires
3. Tester que tout fonctionne
4. Documenter les nouvelles conventions

---

**Status**: ✅ Structure de base créée et nettoyage effectué
**Prochaine étape**: Migration des fichiers restants et mise à jour des chemins