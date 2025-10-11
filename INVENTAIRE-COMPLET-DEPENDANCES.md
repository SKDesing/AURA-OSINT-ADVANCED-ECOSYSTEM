# 📦 INVENTAIRE COMPLET DES DÉPENDANCES ET OUTILS - ÉCOSYSTÈME AURA OSINT

## 📊 VUE D'ENSEMBLE

**Total Dépendances:** ~150+
**Catégories:** 12
**Langages:** JavaScript/Node.js, Python, Shell, SQL
**Services:** 15+

---

## 🎯 BACKEND - NODE.JS (PORT 4011)

### Core Framework
```json
{
  "express": "^4.18.2",           // Framework web principal
  "cors": "^2.8.5",                // Cross-Origin Resource Sharing
  "helmet": "^7.1.0",              // Sécurité HTTP headers
  "compression": "^1.7.4",         // Compression gzip
  "morgan": "^1.10.0"              // Logger HTTP
}
```

### WebSocket & Temps Réel
```json
{
  "ws": "^8.14.2",                 // WebSocket serveur
  "socket.io": "^4.6.1",           // Alternative WebSocket
  "socket.io-client": "^4.6.1"    // Client WebSocket
}
```

### Intelligence Artificielle (IA Qwen)
```json
{
  "@huggingface/inference": "^2.6.4",  // API Hugging Face
  "axios": "^1.6.2",                    // HTTP client
  "dotenv": "^16.3.1",                  // Variables d'environnement
  "natural": "^6.10.3",                 // NLP traitement langage
  "compromise": "^14.10.0",             // Analyse texte
  "sentiment": "^5.0.2"                 // Analyse sentiment
}
```

### Bases de Données - PostgreSQL
```json
{
  "pg": "^8.11.3",                 // Driver PostgreSQL
  "pg-promise": "^11.5.4",         // Promises PostgreSQL
  "sequelize": "^6.35.1",          // ORM
  "sequelize-cli": "^6.6.2"        // CLI Sequelize
}
```

### Bases de Données - Redis
```json
{
  "redis": "^4.6.11",              // Client Redis
  "ioredis": "^5.3.2",             // Alternative Redis client
  "connect-redis": "^7.1.0"        // Session Redis
}
```

### Bases de Données - Elasticsearch
```json
{
  "@elastic/elasticsearch": "^8.11.0",  // Client Elasticsearch
  "elasticsearch": "^16.7.3"             // Legacy client
}
```

### Bases de Données - Qdrant (Vector DB)
```json
{
  "@qdrant/js-client-rest": "^1.7.0",   // Client Qdrant
  "qdrant-client": "^1.7.0"              // Alternative client
}
```

### Validation & Sécurité
```json
{
  "joi": "^17.11.0",               // Validation schémas
  "validator": "^13.11.0",         // Validation données
  "bcrypt": "^5.1.1",              // Hash mots de passe
  "jsonwebtoken": "^9.0.2",        // JWT authentication
  "express-rate-limit": "^7.1.5",  // Rate limiting
  "express-validator": "^7.0.1"    // Validation Express
}
```

### Utilitaires Backend
```json
{
  "lodash": "^4.17.21",            // Utilitaires JS
  "moment": "^2.29.4",             // Manipulation dates
  "uuid": "^9.0.1",                // Génération UUID
  "chalk": "^5.3.0",               // Couleurs terminal
  "ora": "^7.0.1",                 // Spinners terminal
  "enquirer": "^2.4.1"             // Prompts interactifs
}
```

---

## 🎨 FRONTEND - REACT/VANILLA JS (PORT 3000)

### Framework & Core
```json
{
  "react": "^18.2.0",              // Framework UI
  "react-dom": "^18.2.0",          // React DOM
  "react-router-dom": "^6.20.1",   // Routing
  "react-scripts": "5.0.1"         // Scripts React
}
```

### State Management
```json
{
  "zustand": "^4.4.7",             // State management léger
  "immer": "^10.0.3",              // Immutabilité
  "react-query": "^3.39.3"         // Data fetching
}
```

### UI Components & Design
```json
{
  "sweetalert2": "^11.10.1",       // Alertes modernes
  "@headlessui/react": "^1.7.17",  // Composants accessibles
  "framer-motion": "^10.16.16",    // Animations
  "lucide-react": "^0.294.0",      // Icônes
  "react-icons": "^4.12.0"         // Icônes alternatives
}
```

### Charts & Visualisation
```json
{
  "recharts": "^2.10.3",           // Graphiques React
  "chart.js": "^4.4.1",            // Graphiques Canvas
  "react-chartjs-2": "^5.2.0",     // React wrapper Chart.js
  "d3": "^7.8.5"                   // Visualisations avancées
}
```

### Formulaires & Validation
```json
{
  "react-hook-form": "^7.49.2",    // Gestion formulaires
  "yup": "^1.3.3",                 // Validation schémas
  "formik": "^2.4.5"               // Alternative formulaires
}
```

### HTTP & WebSocket Client
```json
{
  "axios": "^1.6.2",               // HTTP client
  "swr": "^2.2.4",                 // Data fetching
  "socket.io-client": "^4.6.1"     // WebSocket client
}
```

### Utilitaires Frontend
```json
{
  "clsx": "^2.0.0",                // Classes conditionnelles
  "classnames": "^2.3.2",          // Classes CSS
  "date-fns": "^2.30.0",           // Manipulation dates
  "lodash": "^4.17.21"             // Utilitaires
}
```

---

## 🧪 TESTING - SUITE DE TESTS (93% RÉUSSITE)

### Test Frameworks
```json
{
  "jest": "^29.7.0",                      // Framework tests
  "vitest": "^1.0.4",                     // Alternative moderne
  "@testing-library/react": "^14.1.2",    // Testing Library React
  "@testing-library/jest-dom": "^6.1.5",  // Matchers Jest
  "@testing-library/user-event": "^14.5.1" // Simulation interactions
}
```

### E2E Testing
```json
{
  "playwright": "^1.40.1",         // Tests E2E navigateur
  "@playwright/test": "^1.40.1",   // Playwright test runner
  "puppeteer": "^21.6.1",          // Alternative E2E
  "cypress": "^13.6.2"             // Tests E2E interactifs
}
```

### Testing Utilities
```json
{
  "jest-environment-jsdom": "^29.7.0",  // Environnement DOM
  "jest-puppeteer": "^9.0.2",           // Jest + Puppeteer
  "msw": "^2.0.8",                      // Mock Service Worker
  "nock": "^13.4.0"                     // HTTP mocking
}
```

### Quality & Coverage
```json
{
  "eslint": "^8.55.0",             // Linter JavaScript
  "prettier": "^3.1.1",            // Formateur code
  "husky": "^8.0.3",               // Git hooks
  "lint-staged": "^15.2.0",        // Lint fichiers staged
  "c8": "^8.0.1"                   // Code coverage
}
```

---

## 🐘 BASES DE DONNÉES

### PostgreSQL 16 (Port 5432)
```yaml
Extensions:
  - timescaledb: "2.13.0"        # Séries temporelles
  - postgis: "3.4.0"             # Données géospatiales
  - pgvector: "0.5.1"            # Embeddings IA
  - pg_trgm: "1.6"               # Recherche floue
  - uuid-ossp: "1.1"             # Génération UUID
  - hstore: "1.8"                # Stockage clé-valeur
```

### Redis 7.2 (Port 6379)
```yaml
Modules:
  - RedisJSON: "2.6"             # Stockage JSON
  - RediSearch: "2.8"            # Recherche full-text
  - RedisGraph: "2.10"           # Base graphes
  - RedisTimeSeries: "1.10"      # Séries temporelles
```

### Elasticsearch 8.11 (Port 9200)
```yaml
Plugins:
  - analysis-icu: "8.11.0"       # Analyse Unicode
  - ingest-attachment: "8.11.0"  # Extraction documents
  - mapper-size: "8.11.0"        # Taille documents
```

### Qdrant 1.7 (Port 6333)
```yaml
Configuration:
  - Collections: "vector_store"  # Stockage vecteurs
  - Distance: "Cosine"           # Métrique similarité
  - Dimension: 384               # Embeddings IA
```

---

## 🛠️ OUTILS OSINT (17 CATÉGORIES)

### 📧 Email Tools (5 outils)
```python
holehe==1.61           # Vérification comptes email
h8mail==2.5.6          # Breach checking
theHarvester==4.3.1    # Email harvesting
hunter-io==2.1.0       # API Hunter.io
clearbit==2.0.3        # Enrichissement email
```

### 📱 Phone Tools (3 outils)
```python
phonenumbers==8.13.26  # Parsing numéros
phoneinfoga==2.10.0    # OSINT téléphone
numverify==1.0.2       # Validation numéros
```

### 👤 Social Media Tools (4 outils)
```python
sherlock-project==0.14.3    # Recherche usernames
social-analyzer==1.3.0      # Analyse réseaux sociaux
instaloader==4.10.3         # Instagram scraping
twint==2.1.21               # Twitter scraping
```

### 🌐 Network Tools (5 outils)
```bash
nmap 7.94              # Scan réseau
whois 5.5.13           # Info domaines
dnsenum 1.3.1          # Énumération DNS
subfinder 2.6.3        # Découverte sous-domaines
amass 4.2.0            # Cartographie réseau
```

### 🔍 Web Scraping & Crawling
```python
beautifulsoup4==4.12.2      # Parsing HTML
scrapy==2.11.0              # Framework scraping
selenium==4.16.0            # Automatisation navigateur
playwright==1.40.0          # Alternative Selenium
requests-html==0.10.0       # Scraping simple
```

### 📊 Data Analysis
```python
pandas==2.1.4          # Manipulation données
numpy==1.26.2          # Calcul numérique
matplotlib==3.8.2      # Visualisations
seaborn==0.13.0        # Graphiques statistiques
```

---

## 🐳 DOCKER & CONTAINERS

### Docker Images
```yaml
Services:
  postgres:16-alpine:
    image: "postgres:16-alpine"
    extensions: [timescaledb, postgis, pgvector]
  
  redis:7.2-alpine:
    image: "redis:7.2-alpine"
    
  elasticsearch:8.11.0:
    image: "docker.elastic.co/elasticsearch/elasticsearch:8.11.0"
    
  qdrant:v1.7.0:
    image: "qdrant/qdrant:v1.7.0"
    
  nginx:alpine:
    image: "nginx:alpine"
```

### Docker Compose Tools
```yaml
docker-compose: "2.23.3"
docker: "24.0.7"
docker-buildx: "0.12.0"
```

---

## 🚀 BUILD & DEPLOYMENT

### Build Tools
```json
{
  "vite": "^5.0.8",            // Build tool moderne
  "webpack": "^5.89.0",        // Bundler
  "rollup": "^4.9.1",          // Module bundler
  "esbuild": "^0.19.10",       // Bundler ultra-rapide
  "swc": "^1.3.100"            // Compilateur Rust
}
```

### Task Runners
```json
{
  "npm-run-all": "^4.1.5",     // Exécution parallèle scripts
  "concurrently": "^8.2.2",    // Commandes concurrentes
  "nodemon": "^3.0.2",         // Auto-reload serveur
  "pm2": "^5.3.0"              // Process manager
}
```

### CI/CD
```yaml
GitHub Actions:
  - actions/checkout@v4
  - actions/setup-node@v4
  - docker/build-push-action@v5
  - codecov/codecov-action@v3
```

---

## 🖥️ BROWSER AUTOMATION

### Electron (Browser Intégré)
```json
{
  "electron": "^28.1.0",           // Framework Electron
  "electron-builder": "^24.9.1",   // Build Electron apps
  "electron-store": "^8.1.0",      // Stockage persistant
  "electron-updater": "^6.1.7"     // Auto-updates
}
```

### Chromium Engine
```json
{
  "puppeteer-core": "^21.6.1",     // Chromium headless
  "playwright-chromium": "^1.40.1", // Alternative Chromium
  "chrome-launcher": "^1.1.0"       // Chrome launcher
}
```

---

## 📝 DOCUMENTATION & MARKDOWN

```json
{
  "markdown-it": "^14.0.0",        // Parser Markdown
  "marked": "^11.1.0",             // Alternative Markdown
  "gray-matter": "^4.0.3",         // Front matter YAML
  "remark": "^15.0.1",             // Processeur Markdown
  "rehype": "^13.0.1"              // Processeur HTML
}
```

---

## 🔐 SÉCURITÉ & CRYPTOGRAPHIE

```json
{
  "crypto-js": "^4.2.0",           // Cryptographie JS
  "bcrypt": "^5.1.1",              // Hash passwords
  "argon2": "^0.31.2",             // Hash alternatif
  "helmet": "^7.1.0",              // Sécurité HTTP
  "express-rate-limit": "^7.1.5",  // Rate limiting
  "xss-clean": "^0.1.4",           // Protection XSS
  "hpp": "^0.2.3"                  // Protection HPP
}
```

---

## 📊 MONITORING & LOGGING

```json
{
  "winston": "^3.11.0",            // Logger avancé
  "pino": "^8.17.2",               // Logger rapide
  "morgan": "^1.10.0",             // HTTP logger
  "debug": "^4.3.4",               // Debugging
  "sentry": "^7.91.0"              // Error tracking
}
```

---

## 🌐 SITE VITRINE - REACT

### Vite + React
```json
{
  "vite": "^5.0.8",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1"
}
```

### Styling
```json
{
  "tailwindcss": "^3.4.0",         // CSS utility-first
  "postcss": "^8.4.32",            // Transformation CSS
  "autoprefixer": "^10.4.16",      // Préfixes CSS
  "sass": "^1.69.5"                // Préprocesseur CSS
}
```

---

## 📦 SCRIPTS PERSONNALISÉS

```bash
# Scripts Shell
launch-aura-complete.js          # Lancement écosystème complet
verify-aura-ecosystem.sh         # Vérification système
fix-aura-ecosystem.sh            # Réparation automatique
test-frontend-complete.sh        # Tests frontend
fix-frontend-issues.sh           # Correction problèmes CSS
monitor-aura.sh                  # Monitoring temps réel
run-all-tests.sh                 # Tous les tests
setup-tests.sh                   # Installation tests
```

---

## 📊 STATISTIQUES GLOBALES

```yaml
Total Dépendances NPM: ~150
Total Outils OSINT: 17 catégories
Total Services Docker: 4 bases de données
Total Tests: 61 (93% réussite)
Langages: JavaScript, Python, Shell, SQL
Frameworks: React, Express, Electron
Bases de Données: PostgreSQL, Redis, Elasticsearch, Qdrant
Port Principal: 4011 (unifié)
```

---

## 🎯 DÉPENDANCES PAR CATÉGORIE

| Catégorie | Nombre | Exemples Principaux |
|-----------|--------|---------------------|
| Backend Core | 25+ | Express, ws, axios |
| IA & NLP | 8 | Hugging Face, natural, sentiment |
| Bases de Données | 15 | pg, redis, elasticsearch |
| Frontend UI | 20+ | React, framer-motion, recharts |
| Testing | 18 | Jest, Playwright, Testing Library |
| OSINT Tools | 17 | Holehe, PhoneInfoga, Sherlock |
| Sécurité | 10 | bcrypt, helmet, rate-limit |
| Build Tools | 12 | Vite, webpack, esbuild |
| Monitoring | 8 | Winston, pino, Sentry |
| Documentation | 6 | markdown-it, remark |

---

## ✅ INSTALLATION COMPLÈTE

```bash
# 1. Backend
cd backend && npm install

# 2. Frontend
cd frontend && npm install

# 3. Site Vitrine
cd marketing/sites/vitrine-aura-advanced-osint-ecosystem && npm install

# 4. Tests
cd frontend && npm install --save-dev

# 5. Outils OSINT Python
pip install -r requirements.txt

# 6. Docker Services
docker-compose up -d
```

---

## 🔄 MISE À JOUR AUTOMATIQUE

```bash
# Vérifier mises à jour disponibles
npm outdated

# Mettre à jour toutes les dépendances
npm update

# Audit sécurité
npm audit fix

# Nettoyer cache
npm cache clean --force
```

---

**Total**: ~150+ dépendances NPM + 17 outils OSINT + 4 bases de données + outils système