# 🛡️ AURA - Advanced Universal Recognition & Analysis

[![CI/CD](https://img.shields.io/github/actions/workflow/status/SKDesing/TikTok-Live-Analyser/chromium-enforcement.yml?branch=main&label=CI%2FCD&logo=github)](https://github.com/SKDesing/TikTok-Live-Analyser/actions)
[![Security Audit](https://img.shields.io/github/actions/workflow/status/SKDesing/TikTok-Live-Analyser/security-audit.yml?branch=main&label=Security%20Audit&logo=shield)](https://github.com/SKDesing/TikTok-Live-Analyser/actions)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)

> **Moteur d'intelligence forensique cross-plateforme world-class** pour l'analyse OSINT, la corrélation d'identités et l'investigation numérique. Architecture enterprise avec monitoring temps réel, logs forensiques et backups automatiques.

## 🚀 Installation Express

```bash
git clone https://github.com/SKDesing/TikTok-Live-Analyser.git
cd TikTok-Live-Analyser
npm run full-setup
npm run gui
```

## 🏗️ Architecture Enterprise

### 🛡️ Sécurité & Monitoring
- **Logs forensiques** avec intégrité cryptographique
- **Monitoring temps réel** CPU, mémoire, disque
- **Backups automatiques** base de données + fichiers
- **Health checks** complets avec alertes
- **Rate limiting** intelligent par endpoint
- **Authentification JWT** avec permissions

### 🎯 Intelligence & Corrélation
- **Extraction OSINT** TikTok, Instagram, Twitter, Facebook
- **Corrélation d'identités** ML avec score de confiance
- **Analyse NLP** multilingue avec TF-IDF
- **Graph Analysis** réseaux sociaux et connexions
- **Export forensique** avec chain of custody

### 🖥️ Interface & API
- **Interface Zéro CLI** - Aucune commande requise
- **Dashboard temps réel** Bootstrap 5 + monitoring
- **API REST complète** avec documentation
- **Chromium Only** enforcement automatique

## 📋 Commandes Principales

```bash
# Démarrage
npm run gui              # Interface graphique
npm start               # API backend
npm run quick-start     # Setup rapide

# Monitoring & Sécurité
npm run health          # Status système
npm run security-report # Audit sécurité
npm run compliance-check # Scan violations

# Maintenance
npm run backup          # Backup manuel
npm run validate-setup  # Validation complète
npm test               # Tests unitaires
```

## 🔧 Configuration

### Variables d'environnement
```bash
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aura_forensic
DB_PASSWORD=your_secure_password

# Sécurité
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key

# Services externes
TIKTOK_API_KEY=your_tiktok_key
SLACK_WEBHOOK=your_webhook_url
```

### Structure des données
```sql
-- 3 bases de données spécialisées
aura_users     -- Gestion utilisateurs (4 tables)
aura_forensic  -- Données OSINT (7 tables)
aura_system    -- Monitoring système (5 tables)
```

## 🔍 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Status système complet |
| `/api/analytics/search` | POST | Recherche cross-platform |
| `/api/analytics/correlate` | POST | Corrélation identités |
| `/api/analytics/export` | POST | Export forensique |
| `/api/admin/dashboard` | GET | Dashboard administrateur |

## 🛡️ Sécurité

### Fonctionnalités
- **Chiffrement automatique** des données sensibles
- **Audit trail** complet avec horodatage
- **Rate limiting** par IP et utilisateur
- **Validation** stricte des entrées
- **Logs forensiques** avec intégrité

### Compliance
- **RGPD** - Gestion des données personnelles
- **Chain of custody** - Traçabilité forensique
- **Chromium Only** - Environnement contrôlé
- **Backup chiffré** - Protection des données

## 📊 Monitoring

### Métriques surveillées
- **CPU, Mémoire, Disque** - Seuils configurables
- **Temps de réponse** - APIs et services
- **Erreurs système** - Logs centralisés
- **Connexions réseau** - Monitoring actif

### Alertes automatiques
- **Seuils dépassés** - CPU > 80%, Mémoire > 85%
- **Services indisponibles** - Health checks
- **Erreurs critiques** - Logs forensiques
- **Tentatives d'intrusion** - Rate limiting

## 🔄 Backups

### Planification automatique
- **Base de données** - Toutes les 6h
- **Fichiers système** - Quotidien
- **Logs forensiques** - Toutes les 12h
- **Rétention** - 7j/4sem/12mois

### Intégrité
- **Checksums SHA-256** - Vérification intégrité
- **Compression** - Optimisation espace
- **Chiffrement** - Protection données
- **Tests de restauration** - Validation automatique

## 🧪 Tests & Qualité

```bash
npm test                    # Tests unitaires (85% coverage)
npm run test:integration    # Tests d'intégration (78% coverage)
npm run benchmark          # Tests performance
npm run security-report    # Scan sécurité (100% coverage)
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit avec convention (`git commit -m 'feat: Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards
- **Commits** : [Conventional Commits](https://conventionalcommits.org/)
- **Code** : ESLint + Prettier
- **Tests** : Jest + 80% coverage minimum
- **Sécurité** : Scan automatique pre-commit

## 📄 Licence & Support

**Licence** : MIT - voir [LICENSE](./LICENSE)

**Auteur** : Kaabache Soufiane  
**Email** : contact@tiktokliveanalyser.com  
**Security** : security@tiktokliveanalyser.com

---

<div align="center">

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !**

[![GitHub stars](https://img.shields.io/github/stars/SKDesing/TikTok-Live-Analyser?style=social)](https://github.com/SKDesing/TikTok-Live-Analyser/stargazers)

</div>