# 🛡️ AURA - Advanced Universal Recognition & Analysis

[![CI/CD](https://img.shields.io/github/actions/workflow/status/SKDesing/TikTok-Live-Analyser/chromium-enforcement.yml?branch=main&label=CI%2FCD&logo=github)](https://github.com/SKDesing/TikTok-Live-Analyser/actions)
[![Security Audit](https://img.shields.io/github/actions/workflow/status/SKDesing/TikTok-Live-Analyser/security-audit.yml?branch=main&label=Security%20Audit&logo=shield)](https://github.com/SKDesing/TikTok-Live-Analyser/actions)
[![Update Guardian](https://img.shields.io/badge/Update%20Guardian-Active%20%E2%9C%93-brightgreen?logo=dependabot)](./AURA-UPDATE-GUARDIAN.md)
[![Security](https://img.shields.io/badge/Security-git--crypt%20%E2%9C%93-green?logo=lock)](./README-SECURITY.md)
[![Chromium Only](https://img.shields.io/badge/Browser-Chromium%20Only%20%E2%9C%93-blue?logo=googlechrome)](./chromium-only-enforcer.js)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)

> **Moteur d'intelligence forensique cross-plateforme world-class** pour l'analyse OSINT, la corrélation d'identités et l'investigation numérique. Interface zéro CLI, enforcement Chromium, chiffrement automatique.

---

## 📋 Table des Matières

- [🏗️ Architecture](#️-architecture)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Installation Rapide](#-installation-rapide)
- [💻 Utilisation](#-utilisation)
- [🔧 API Reference](#-api-reference)
- [🔐 Sécurité](#-sécurité)
- [🧪 Tests & Qualité](#-tests--qualité)
- [🤝 Contribution](#-contribution)
- [❓ FAQ](#-faq)

---

## 🏗️ Architecture

```mermaid
flowchart TD
    GUI[🖥️ Interface Web GUI<br/>Bootstrap 5 + Express]
    API[🔌 Analytics API<br/>Node.js + REST]
    DB[(🗄️ Database Maestro<br/>PostgreSQL + Schema)]
    ENGINE[🧠 Correlation Engine<br/>NLP + ML + Graph)]
    CHROMIUM[🌐 Chromium Launcher<br/>Enforcement + Security]
    SECURITY[🔐 Security Manager<br/>git-crypt + GPG]
    
    GUI -->|HTTP/REST| API
    API -->|SQL Queries| DB
    API -->|Identity Matching| ENGINE
    GUI -->|Browser Launch| CHROMIUM
    API -->|Data Encryption| SECURITY
    ENGINE -->|Forensic Data| DB
    
    subgraph "🛡️ Security Layer"
        SECURITY
        CHROMIUM
    end
    
    subgraph "🎯 Core Intelligence"
        ENGINE
        DB
    end
    
    subgraph "🖱️ User Interface"
        GUI
        API
    end
```

### Modules Principaux

| Module | Fonction | Technologie | Status |
|--------|----------|-------------|--------|
| [GUI Launcher](./gui-launcher.js) | Interface web zéro CLI | Express.js + Bootstrap 5 | ✅ Actif |
| [Correlation Engine](./correlation-engine-complete.js) | Matching identités cross-plateforme | NLP + ML + Graph | ✅ Actif |
| [Database Maestro](./database-maestro-schema.sql) | Schema forensique unifié | PostgreSQL + Chain of Custody | ✅ Actif |
| [Analytics API](./analytics-api.js) | REST API + Export | Node.js + Express | ✅ Actif |
| [Chromium Enforcer](./chromium-only-enforcer.js) | Sécurité navigateur | Automated Scanner + Fixer | ✅ Actif |
| [Security Manager](./security-manager.js) | Chiffrement données | git-crypt + GPG | ✅ Actif |

---

## ✨ Fonctionnalités

### 🎯 Intelligence & Corrélation

| Fonctionnalité | Support | Plateformes | Description |
|----------------|---------|-------------|-------------|
| **Extraction OSINT** | ✅ | TikTok, Instagram, Twitter, Facebook | Collecte automatisée de données publiques |
| **Corrélation d'identités** | ✅ | Cross-platform | Matching ML avec score de confiance |
| **Analyse NLP** | ✅ | Multilingue | TF-IDF, stemming, sentiment analysis |
| **Graph Analysis** | ✅ | Neo4j compatible | Réseaux sociaux et connexions |
| **Export forensique** | ✅ | JSON, CSV, PDF | Chain of custody + SHA-256 |

### 🛡️ Sécurité & Compliance

| Fonctionnalité | Support | OS | Description |
|----------------|---------|-------|-------------|
| **Chromium Only** | ✅ | Linux, Windows, macOS | Enforcement automatique, 0 fallback |
| **Chiffrement git-crypt** | ✅ | Tous | Données sensibles chiffrées auto |
| **Audit Trail** | ✅ | Tous | Logs forensiques horodatés |
| **CI/CD Security** | ✅ | GitHub Actions | Scan + fix automatique |

### 🖥️ Interface & Expérience

| Fonctionnalité | Support | Technologie | Description |
|----------------|---------|-------------|-------------|
| **Interface Zéro CLI** | ✅ | Web GUI | Aucune commande requise |
| **Dashboard temps réel** | ✅ | Bootstrap 5 | Monitoring système + compliance |
| **Installation 1-click** | ✅ | Scripts automatisés | Setup complet en une commande |
| **API REST complète** | ✅ | Express.js | Intégration tiers facilitée |

---

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 13+
- Git 2.30+

### Installation Express (1 commande)
```bash
git clone https://github.com/SKDesing/TikTok-Live-Analyser.git
cd TikTok-Live-Analyser
npm run full-setup
```

### Démarrage GUI
```bash
npm run gui
# 🌐 Interface disponible sur http://localhost:3000
```

### Installation Détaillée

<details>
<summary>📋 Installation pas à pas</summary>

1. **Clone et dépendances**
   ```bash
   git clone https://github.com/SKDesing/TikTok-Live-Analyser.git
   cd TikTok-Live-Analyser
   npm install
   ```

2. **Configuration sécurité**
   ```bash
   npm run security-setup    # git-crypt + GPG
   npm run migrate-chromium  # Migration Brave → Chromium
   ```

3. **Base de données**
   ```bash
   createdb aura_forensic
   psql aura_forensic < database-maestro-schema.sql
   ```

4. **Validation**
   ```bash
   npm run validate-setup
   npm test
   ```

</details>

---

## 💻 Utilisation

### Interface Graphique (Recommandé)
```bash
npm run gui
```
![AURA Dashboard](./docs/assets/screenshots/dashboard.png)

### API REST
```bash
npm start  # Analytics API sur port 4002
```

### CLI (Avancé)
```bash
# Analyse OSINT
node correlation-engine-complete.js --target @username

# Scan sécurité
npm run compliance-check

# Export forensique
curl -X POST http://localhost:4002/api/analytics/export
```

---

## 🔧 API Reference

### Endpoints Principaux

| Endpoint | Méthode | Description | Exemple |
|----------|---------|-------------|---------|
| `/api/status` | GET | Status système | `{"status": "running", "services": [...]}` |
| `/api/analytics/search` | POST | Recherche cross-platform | `{"query": "username", "platforms": ["tiktok"]}` |
| `/api/analytics/correlate` | POST | Corrélation identités | `{"profiles": [...], "threshold": 0.8}` |
| `/api/analytics/export` | POST | Export forensique | `{"format": "json", "evidence_id": "..."}` |
| `/api/chromium/scan` | GET | Scan compliance | `{"violations": 0, "status": "compliant"}` |
| `/api/security/report` | GET | Rapport sécurité | `{"encryption": {...}, "recommendations": [...]}` |

### Exemple d'utilisation

<details>
<summary>🔍 Recherche OSINT</summary>

```javascript
// Recherche cross-platform
const response = await fetch('/api/analytics/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'target_username',
    platforms: ['tiktok', 'instagram'],
    options: { deep_search: true }
  })
});

const results = await response.json();
// {
//   "matches": [...],
//   "correlation_score": 0.95,
//   "evidence_hash": "sha256:...",
//   "timestamp": "2024-01-15T10:30:00Z"
// }
```

</details>

---

## 🔐 Sécurité

### Chiffrement Automatique
- **Fichiers sensibles** chiffrés via git-crypt
- **Clés GPG** pour accès contrôlé
- **Audit trail** complet

### Chromium Only Policy
- **Enforcement automatique** - Aucun navigateur système
- **Scanner CI/CD** - Détection violations
- **Auto-correction** - Fix automatique

### Compliance
```bash
npm run security-report    # Audit complet
npm run compliance-check   # Scan violations
```

📖 **Guide complet**: [README-SECURITY.md](./README-SECURITY.md)

---

## 🧪 Tests & Qualité

### Status Tests

| Type | Status | Coverage | Commande |
|------|--------|----------|----------|
| **Unit Tests** | ✅ | 85% | `npm test` |
| **Integration** | ✅ | 78% | `npm run test:integration` |
| **Security Scan** | ✅ | 100% | `npm run security-report` |
| **Compliance** | ✅ | 100% | `npm run compliance-check` |
| **Performance** | ✅ | - | `npm run benchmark` |

### Lancement Tests
```bash
npm test                    # Tests unitaires
npm run test:integration    # Tests d'intégration
npm run benchmark          # Tests performance
```

---

## 🤝 Contribution

### Workflow
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'feat: Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards
- **Commits**: [Conventional Commits](https://conventionalcommits.org/)
- **Code**: ESLint + Prettier
- **Tests**: Jest + 80% coverage minimum
- **Security**: Scan automatique pre-commit

### Pre-commit Hooks
```bash
npm run prepare  # Installation hooks Husky
# Auto-scan compliance + security avant chaque commit
```

---

## ❓ FAQ

<details>
<summary><strong>Pourquoi "Chromium Only" ?</strong></summary>

- **Sécurité**: Contrôle total du navigateur utilisé
- **Compatibilité**: Comportement prévisible cross-platform  
- **Forensique**: Environnement d'exécution maîtrisé
- **Audit**: Traçabilité complète des actions

</details>

<details>
<summary><strong>Comment accéder aux données chiffrées ?</strong></summary>

```bash
# Déchiffrement avec clé GPG
git-crypt unlock

# Ou avec clé exportée
git-crypt unlock aura-security.key
```

</details>

<details>
<summary><strong>Compatibilité OS ?</strong></summary>

| OS | Support | Notes |
|----|---------| ------|
| Linux | ✅ Full | Recommandé pour production |
| Windows | ✅ Full | WSL2 recommandé |
| macOS | ✅ Full | Intel + Apple Silicon |

</details>

---

## 🎨 Frontend Architecture Moderne

### Stack Technique
- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Radix UI + Tailwind CSS avec design tokens AURA
- **State**: TanStack Query + Zustand
- **API**: Client type-safe avec Zod validation
- **i18n**: next-intl (FR/EN)

### Composants Clés
- **AppShell**: Navigation responsive avec sidebar
- **Design System**: Composants accessibles (Button, Input, Toast)
- **Dashboard**: Stats temps réel et actions rapides
- **API Client**: Gestion d'erreurs et retry automatique

### Fonctionnalités UX
- Interface "Beginner-first" avec mode Pro
- Progressive disclosure et guidance contextuelle
- SSE pour updates temps réel
- Accessibilité WCAG 2.2 AA

📖 **Détails complets**: [FRONTEND-REFACTORING-PLAN.md](./FRONTEND-REFACTORING-PLAN.md) | [ARCHITECTURE-VISUELLE.md](./ARCHITECTURE-VISUELLE.md)

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/SKDesing/TikTok-Live-Analyser/issues)
- **Documentation**: [Wiki](https://github.com/SKDesing/TikTok-Live-Analyser/wiki)
- **Email**: contact@tiktokliveanalyser.com
- **Security**: security@tiktokliveanalyser.com

---

## 📄 Licence & Crédits

**Licence**: MIT - voir [LICENSE](./LICENSE)

**Auteur**: Kaabache Soufiane  
**Organisation**: TikTok Live Analyser  
**Version**: 2.0.0

---

<div align="center">

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !**

[![GitHub stars](https://img.shields.io/github/stars/SKDesing/TikTok-Live-Analyser?style=social)](https://github.com/SKDesing/TikTok-Live-Analyser/stargazers)

</div>