# 🚀 AURA OSINT ADVANCED ECOSYSTEM

**Professional OSINT Platform for Advanced Intelligence Gathering**

[![Build](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/workflows/Smoke%20Run%20(Backend%20+%20AI)/badge.svg)](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/actions)
[![CodeQL](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/workflows/CodeQL/badge.svg)](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/security/code-scanning)
[![SBOM](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/workflows/SBOM%20Generation/badge.svg)](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/actions)
[![Release](https://img.shields.io/github/v/release/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM)](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/releases)
[![Benchmarks](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/workflows/Performance%20Benchmarks/badge.svg)](https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/actions)
[![Security](https://img.shields.io/badge/Security-Hardened-green)](docs/AURA-PLAYBOOK.md#sécurité--durcissement)

---

## 🎯 **PROJECT OVERVIEW**

**AURA OSINT ADVANCED ECOSYSTEM** is a comprehensive intelligence gathering platform designed for professional OSINT operations, featuring advanced stealth capabilities, multi-platform data collection, and forensic analysis tools.

### **🏗️ CORE COMPONENTS**
- **🔍 Observability Dashboard**: Real-time KPIs and metrics
- **🧠 Router Decisions**: AI decision tracking and analysis  
- **📚 RAG Explorer**: Query and context exploration
- **🛡️ Guardrails & Policies**: Security rule management
- **⚡ AI Efficiency**: Token optimization and caching
- **🕵️ Forensic Timeline**: Correlation and anomaly detection

---

## 📊 **ARCHITECTURE**

```
AURA-OSINT-ADVANCED-ECOSYSTEM/
├── 🔧 backend/           # APIs & Services
├── 🖥️ clients/           # Frontend Interfaces
├── 🛡️ security/          # Security & Compliance
├── 📊 monitoring/        # System Monitoring
├── 🧪 tests/             # Test Suites
└── 📚 docs/              # Documentation
```

---

## ⚡ **QUICK START**

### **Installation**
```bash
git clone https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git
cd AURA-OSINT-ADVANCED-ECOSYSTEM
npm install
```

### **Launch**
```bash
npm start
```

### **Health Check**
```bash
curl http://localhost:4010/ai/health
```

---

## 🎯 **KEY FEATURES**

- ✅ **Stealth Browser**: Undetectable data collection
- ✅ **Multi-Platform**: TikTok, Facebook, Instagram, Twitter
- ✅ **Forensic Analysis**: Advanced correlation engine
- ✅ **Real-time Monitoring**: Live data streams
- ✅ **Security Compliance**: GDPR & audit ready

---

## 📈 **PERFORMANCE**

- **AI Embeddings**: P50/P95/P99 = 26ms/35ms/35ms (≤30ms SLO)
- **Router Accuracy**: 92.3% bypass detection, 75% stealth rate
- **Data Processing**: 100k+ records/minute
- **Uptime**: 99.9% availability (SLA guaranteed)
- **Scalability**: 1000+ concurrent operations

---

## 🛡️ **SECURITY**

- **Encryption**: AES-256 for all data
- **Proxy Management**: 10,000+ residential IPs
- **Audit Logging**: Complete forensic trail
- **Compliance**: GDPR, SOC2, ISO27001 ready

---

## 📞 **CONTACT**

**Author**: Sofiane Kaabache  
**Email**: contact@aura-osint.com  
**Repository**: https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM

---

**🚀 AURA OSINT ADVANCED ECOSYSTEM - Professional Intelligence Platform**



# 📘 AURA OSINT - GUIDE COMPLET DÉVELOPPEMENT

## 🎯 OBJECTIF DU PROJET

Développer un **dashboard admin professionnel** basé sur Black Dashboard React pour la plateforme AURA OSINT, permettant la gestion complète des opérations d'intelligence gathering, analyse forensique, et monitoring en temps réel.

---

## 📋 TABLE DES MATIÈRES

1. [Architecture & Structure](#architecture)
2. [Standards de Code](#standards)
3. [Convention de Nommage](#naming)
4. [Git Workflow](#git)
5. [Configuration Environnement](#environment)
6. [API & Services](#api)
7. [State Management](#state)
8. [Sécurité](#security)
9. [Tests](#tests)
10. [Performance](#performance)
11. [Documentation](#documentation)
12. [Déploiement](#deployment)

---

<a name="architecture"></a>
## 🏗️ 1. ARCHITECTURE & STRUCTURE

### 1.1 Structure des Dossiers

```
clients/dashboard-admin/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/              # Images, fonts, styles statiques
│   │   ├── css/
│   │   ├── fonts/
│   │   ├── img/
│   │   └── scss/
│   │
│   ├── components/          # Composants réutilisables
│   │   ├── common/          # Composants génériques
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.test.js
│   │   │   │   └── Button.module.scss
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── DataTable/
│   │   │   └── index.js
│   │   │
│   │   ├── charts/          # Composants graphiques
│   │   │   ├── LineChart/
│   │   │   ├── BarChart/
│   │   │   ├── PieChart/
│   │   │   └── index.js
│   │   │
│   │   ├── forms/           # Composants de formulaires
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── DatePicker/
│   │   │   └── index.js
│   │   │
│   │   └── widgets/         # Widgets métier
│   │       ├── KPICard/
│   │       ├── AlertsPanel/
│   │       ├── MetricsChart/
│   │       └── index.js
│   │
│   ├── layouts/             # Layouts principaux
│   │   ├── Admin/
│   │   │   ├── Admin.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── Auth/
│   │       ├── Auth.jsx
│   │       └── AuthNavbar.jsx
│   │
│   ├── views/               # Pages/Vues
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.module.scss
│   │   ├── OSINT/
│   │   │   ├── TikTokAnalyzer.jsx
│   │   │   ├── FacebookIntel.jsx
│   │   │   ├── InstagramMonitor.jsx
│   │   │   └── TwitterTracker.jsx
│   │   ├── Forensic/
│   │   ├── RAG/
│   │   ├── Security/
│   │   └── Auth/
│   │
│   ├── services/            # Services & API
│   │   ├── api/
│   │   │   ├── client.js           # Axios instance configurée
│   │   │   ├── osintService.js
│   │   │   ├── forensicService.js
│   │   │   ├── ragService.js
│   │   │   ├── securityService.js
│   │   │   ├── metricsService.js
│   │   │   └── authService.js
│   │   │
│   │   ├── websocket/
│   │   │   └── realtimeService.js
│   │   │
│   │   └── storage/
│   │       └── localStorageService.js
│   │
│   ├── store/               # State Management
│   │   ├── authStore.js
│   │   ├── osintStore.js
│   │   ├── metricsStore.js
│   │   └── uiStore.js
│   │
│   ├── hooks/               # Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useWebSocket.js
│   │   ├── useApi.js
│   │   ├── useDebounce.js
│   │   └── usePagination.js
│   │
│   ├── utils/               # Utilitaires
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── encryption.js
│   │   └── logger.js
│   │
│   ├── config/              # Configuration
│   │   ├── routes.js
│   │   ├── api.config.js
│   │   ├── theme.config.js
│   │   └── permissions.js
│   │
│   ├── types/               # TypeScript types (si TS utilisé)
│   │   ├── api.types.ts
│   │   ├── models.types.ts
│   │   └── components.types.ts
│   │
│   ├── App.jsx              # Composant racine
│   ├── index.js             # Point d'entrée
│   └── routes.js            # Configuration des routes
│
├── .env.development         # Variables d'environnement dev
├── .env.production          # Variables d'environnement prod
├── .eslintrc.js             # Configuration ESLint
├── .prettierrc              # Configuration Prettier
├── jsconfig.json            # Configuration path aliases
├── package.json
└── README.md
```

### 1.2 Architecture en Couches

```
┌─────────────────────────────────────┐
│         PRESENTATION LAYER          │
│  (Components, Views, Layouts)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         BUSINESS LOGIC LAYER        │
│    (Hooks, Store, Services)         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         DATA ACCESS LAYER           │
│    (API Services, WebSocket)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         BACKEND API                 │
│    (REST API, WebSocket Server)     │
└─────────────────────────────────────┘
```

---

<a name="standards"></a>
## 📐 2. STANDARDS DE CODE

### 2.1 JavaScript/React Standards

#### ✅ OBLIGATOIRE:

```javascript
// 1. Utiliser les Functional Components avec Hooks
// ✅ CORRECT
const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <div>Dashboard Content</div>;
};

// ❌ INCORRECT - Pas de class components
class Dashboard extends React.Component { ... }

// 2. Destructurer les props
// ✅ CORRECT
const UserCard = ({ name, email, role }) => {
  return (
    <Card>
      <h3>{name}</h3>
      <p>{email}</p>
    </Card>
  );
};

// ❌ INCORRECT
const UserCard = (props) => {
  return <h3>{props.name}</h3>;
};

// 3. Utiliser PropTypes ou TypeScript
import PropTypes from 'prop-types';

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['admin', 'user', 'viewer'])
};

// 4. Nommer les exports
// ✅ CORRECT
export const fetchUsers = () => { ... };
export default Dashboard;

// ❌ INCORRECT
export default () => { ... };

// 5. Async/Await au lieu de .then()
// ✅ CORRECT
const fetchData = async () => {
  try {
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    handleError(error);
  }
};

// ❌ INCORRECT
const fetchData = () => {
  api.getData()
    .then(res => setData(res.data))
    .catch(err => console.log(err));
};

// 6. Gestion des erreurs OBLIGATOIRE
const fetchData = async () => {
  try {
    const response = await api.getData();
    return response.data;
  } catch (error) {
    logger.error('Error fetching data:', error);
    toast.error('Échec du chargement des données');
    throw error;
  }
};

// 7. Éviter le code imbriqué (max 3 niveaux)
// ✅ CORRECT
const processData = (data) => {
  if (!data) return null;
  if (!data.items) return [];
  return data.items.filter(isValid).map(transform);
};

// ❌ INCORRECT - Trop imbriqué
const processData = (data) => {
  if (data) {
    if (data.items) {
      return data.items.filter(item => {
        if (item.active) {
          return item.value > 0;
        }
      });
    }
  }
};
```

### 2.2 Hooks Best Practices

```javascript
// 1. Custom Hooks pour logique réutilisable
const useOSINTData = (platform) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await osintService.getData(platform);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [platform]);

  return { data, loading, error };
};

// 2. Utiliser useMemo pour calculs coûteux
const expensiveData = useMemo(() => {
  return processLargeDataset(rawData);
}, [rawData]);

// 3. Utiliser useCallback pour fonctions passées aux enfants
const handleSubmit = useCallback((values) => {
  submitForm(values);
}, [submitForm]);

// 4. Cleanup dans useEffect
useEffect(() => {
  const socket = connectWebSocket();
  
  return () => {
    socket.disconnect();
  };
}, []);
```

### 2.3 Style & Formatting

```javascript
// ESLint Configuration (.eslintrc.js)
module.exports = {
  extends: [
    'react-app',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'error',
    'max-len': ['warn', { code: 100 }],
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-const': 'error'
  }
};

// Prettier Configuration (.prettierrc)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

---

<a name="naming"></a>
## 🏷️ 3. CONVENTIONS DE NOMMAGE

### 3.1 Fichiers & Dossiers

```
✅ CORRECT:
- Components: PascalCase → UserCard.jsx, MetricsChart.jsx
- Services: camelCase → osintService.js, authService.js
- Utils: camelCase → formatters.js, validators.js
- Hooks: camelCase avec préfixe 'use' → useAuth.js, useWebSocket.js
- Constants: UPPER_SNAKE_CASE → API_ENDPOINTS.js, ERROR_CODES.js
- Styles: kebab-case → user-card.module.scss

❌ INCORRECT:
- usercard.jsx
- OSINTSERVICE.js
- use-auth.js
```

### 3.2 Variables & Fonctions

```javascript
// Variables: camelCase
const userData = {};
const isAuthenticated = false;
const totalCount = 100;

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.aura-osint.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// Fonctions: camelCase avec verbe
const fetchUserData = () => {};
const handleSubmit = () => {};
const validateInput = () => {};
const transformData = () => {};

// Boolean: préfixer avec is, has, can, should
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldUpdate = false;

// Handlers: préfixer avec 'handle'
const handleClick = () => {};
const handleChange = () => {};
const handleSubmit = () => {};

// API Calls: préfixer avec action
const getUsers = () => {};
const createUser = () => {};
const updateUser = () => {};
const deleteUser = () => {};

// Arrays: pluriel
const users = [];
const items = [];
const metrics = [];

// Components: PascalCase
const UserProfile = () => {};
const DataTable = () => {};
```

### 3.3 Routes & API Endpoints

```javascript
// Routes frontend: kebab-case
/dashboard
/osint-operations
/forensic-analysis
/user-management
/security-policies

// API Endpoints: kebab-case
GET    /api/v1/osint-data
POST   /api/v1/forensic-analysis
PUT    /api/v1/users/:id
DELETE /api/v1/sessions/:id
```

---

<a name="git"></a>
## 🔀 4. GIT WORKFLOW

### 4.1 Structure des Branches

```
main (production)
  ↓
develop (intégration)
  ↓
feature/*, bugfix/*, hotfix/*
```

### 4.2 Nommage des Branches

```bash
# Features
feature/osint-tiktok-analyzer
feature/forensic-timeline
feature/user-authentication

# Bug fixes
bugfix/metrics-chart-display
bugfix/api-timeout-handling

# Hotfixes (production urgente)
hotfix/security-vulnerability
hotfix/critical-crash

# Releases
release/v1.0.0
release/v1.1.0
```

### 4.3 Commit Messages (Convention Conventional Commits)

```bash
# Format:
<type>(<scope>): <subject>

# Types:
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
docs:     Documentation
style:    Formatage, pas de changement de code
refactor: Refactorisation
test:     Ajout/modification de tests
chore:    Tâches de maintenance
perf:     Amélioration de performance

# Exemples:
feat(osint): add TikTok live stream analyzer
fix(dashboard): resolve metrics chart rendering issue
docs(api): update API documentation for forensic service
refactor(auth): simplify authentication logic
test(services): add unit tests for OSINT service
chore(deps): update react to version 18.2.0
perf(charts): optimize data processing for large datasets

# Message complet:
feat(osint): add TikTok live stream analyzer

- Implement real-time stream monitoring
- Add chat analysis functionality
- Integrate proxy rotation system

Closes #123
```

### 4.4 Pull Request Process

```markdown
## PR Template

### Description
Brief description of changes

### Type of Change
- [ ] Feature (nouvelle fonctionnalité)
- [ ] Bugfix (correction)
- [ ] Hotfix (correction urgente production)
- [ ] Refactor (refactorisation)
- [ ] Documentation

### Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Browser compatibility checked

### Screenshots
(if applicable)

### Related Issues
Closes #issue_number
```

### 4.5 Git Commands Workflow

```bash
# 1. Créer une nouvelle feature
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# 2. Développer et commit
git add .
git commit -m "feat(module): description"

# 3. Push la branche
git push origin feature/my-new-feature

# 4. Créer PR sur GitHub/GitLab

# 5. Après validation, merger dans develop
# (via interface GitHub/GitLab)

# 6. Supprimer la branche locale
git branch -d feature/my-new-feature

# 7. Mettre à jour develop
git checkout develop
git pull origin develop
```

---

<a name="environment"></a>
## ⚙️ 5. CONFIGURATION ENVIRONNEMENT

### 5.1 Variables d'Environnement

```bash
# .env.development
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_WS_URL=ws://localhost:3000
REACT_APP_ENABLE_LOGS=true
REACT_APP_ENABLE_REDUX_DEVTOOLS=true

# .env.production
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.aura-osint.com/api/v1
REACT_APP_WS_URL=wss://api.aura-osint.com
REACT_APP_ENABLE_LOGS=false
REACT_APP_ENABLE_REDUX_DEVTOOLS=false

# .env.staging
REACT_APP_ENV=staging
REACT_APP_API_URL=https://staging-api.aura-osint.com/api/v1
REACT_APP_WS_URL=wss://staging-api.aura-osint.com
REACT_APP_ENABLE_LOGS=true
REACT_APP_ENABLE_REDUX_DEVTOOLS=true
```

### 5.2 Configuration API Client

```javascript
// src/services/api/client.js
import axios from 'axios';
import { getAuthToken, refreshToken } from '../storage/localStorageService';
import { logger } from '../../utils/logger';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    logger.info(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.info(`API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    logger.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

<a name="api"></a>
## 🌐 6. API & SERVICES

### 6.1 Structure des Services

```javascript
// src/services/api/osintService.js
import apiClient from './client';
import { logger } from '../../utils/logger';

class OSINTService {
  /**
   * Récupère les données OSINT pour une plateforme
   * @param {string} platform - Nom de la plateforme (tiktok, facebook, etc.)
   * @param {object} params - Paramètres de recherche
   * @returns {Promise<object>}
   */
  async getData(platform, params = {}) {
    try {
      const response = await apiClient.get(`/osint/${platform}`, { params });
      return response.data;
    } catch (error) {
      logger.error(`Error fetching OSINT data for ${platform}:`, error);
      throw error;
    }
  }

  /**
   * Analyse un profil utilisateur
   * @param {string} platform - Plateforme
   * @param {string} username - Nom d'utilisateur
   * @returns {Promise<object>}
   */
  async analyzeProfile(platform, username) {
    try {
      const response = await apiClient.post(`/osint/${platform}/analyze`, {
        username,
      });
      return response.data;
    } catch (error) {
      logger.error(`Error analyzing profile ${username}:`, error);
      throw error;
    }
  }

  /**
   * Surveille un stream en direct
   * @param {string} platform - Plateforme
   * @param {string} streamId - ID du stream
   * @returns {Promise<object>}
   */
  async monitorLiveStream(platform, streamId) {
    try {
      const response = await apiClient.post(`/osint/${platform}/monitor-stream`, {
        streamId,
      });
      return response.data;
    } catch (error) {
      logger.error(`Error monitoring stream ${streamId}:`, error);
      throw error;
    }
  }

  /**
   * Exporte les données OSINT
   * @param {string} format - Format d'export (json, csv, pdf)
   * @param {object} data - Données à exporter
   * @returns {Promise<Blob>}
   */
  async exportData(format, data) {
    try {
      const response = await apiClient.post(
        `/osint/export`,
        { data },
        {
          params: { format },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`Error exporting data:`, error);
      throw error;
    }
  }
}

export default new OSINTService();
```

### 6.2 Gestion des Erreurs API

```javascript
// src/utils/errorHandler.js
import { toast } from 'react-toastify';
import { logger } from './logger';

export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        toast.error(data.message || 'Requête invalide');
        break;
      case 401:
        toast.error('Session expirée. Veuillez vous reconnecter.');
        // Redirect to login
        window.location.href = '/auth/login';
        break;
      case 403:
        toast.error('Accès refusé. Permissions insuffisantes.');
        break;
      case 404:
        toast.error('Ressource non trouvée');
        break;
      case 429:
        toast.error('Trop de requêtes. Veuillez patienter.');
        break;
      case 500:
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
        break;
      default:
        toast.error(data.message || 'Une erreur est survenue');
    }
    
    logger.error(`API Error [${status}]:`, data);
  } else if (error.request) {
    // Pas de réponse du serveur
    toast.error('Impossible de joindre le serveur');
    logger.error('No response from server:', error.request);
  } else {
    // Erreur dans la configuration de la requête
    toast.error('Erreur lors de la requête');
    logger.error('Request setup error:', error.message);
  }
};
```

---

<a name="state"></a>
## 🗄️ 7. STATE MANAGEMENT

### 7.1 Zustand Store (Recommandé)

```javascript
// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/api/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          return response;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      updateProfile: async (data) => {
        set({ loading: true });
        try {
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser, loading: false });
          return updatedUser;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      checkAuth: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

```javascript
// src/store/osintStore.js
import { create } from 'zustand';
import osintService from '../services/api/osintService';

export const useOSINTStore = create((set, get) => ({
  data: [],
  selectedPlatform: 'tiktok',
  loading: false,
  error: null,
  filters: {},

  // Actions
  fetchData: async (platform, params) => {
    set({ loading: true, error: null });
    try {
      const data = await osintService.getData(platform, params);
      set({ data, loading: false, selectedPlatform: platform });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchData(get().selectedPlatform, filters);
  },

  clearData: () => {
    set({ data: [], filters: {}, error: null });
  },
}));
```

### 7.2 Custom Hooks

```javascript
// src/hooks/useAuth.js
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, loading, error } = useAuthStore();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    loading,
    error,
  };
};
```

```javascript
// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { logger } from '../utils/logger';

export const useWebSocket = (namespace = '') => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    socketRef.current = io(`${process.env.REACT_APP_WS_URL}${namespace}`, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      logger.info('WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      logger.warn('WebSocket disconnected');
    });

    socketRef.current.on('message', (data) => {
      setLastMessage(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [namespace]);

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      logger.error('WebSocket not connected');
    }
  };

  const on = (event, callback) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event) => {
    socketRef.current?.off(event);
  };

  return {
    isConnected,
    lastMessage,
    emit,
    on,
    off,
  };
};
```

---

<a name="security"></a>
## 🔐 8. SÉCURITÉ

### 8.1 Authentication & Authorization

```javascript
// src/utils/auth.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

/**
 * Chiffre les données sensibles
 */
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

/**
 * Déchiffre les données
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Vérifie si le token JWT est valide
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

/**
 * Vérifie les permissions utilisateur
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission) || user.role === 'admin';
};
```

```javascript
// src/components/common/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { hasPermission } from '../../../utils/auth';

const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 8.2 Input Validation & Sanitization

```javascript
// src/utils/validators.js
import DOMPurify from 'dompurify';

/**
 * Valide un email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valide un mot de passe (min 8 car, 1 maj, 1 min, 1 chiffre, 1 spécial)
 */
export const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Valide un username (alphanumerique, underscore, tiret)
 */
export const isValidUsername = (username) => {
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(username);
};

/**
 * Nettoie le HTML pour éviter XSS
 */
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

/**
 * Échappe les caractères spéciaux
 */
export const escapeString = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Valide une URL
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
```

### 8.3 Security Headers & CSP

```javascript
// src/utils/security.js

/**
 * Configuration Content Security Policy
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", process.env.REACT_APP_API_URL],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

/**
 * Ajoute les headers de sécurité
 */
export const addSecurityHeaders = (headers) => {
  return {
    ...headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
};

/**
 * Rate limiting client-side
 */
export class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
}
```

---

<a name="tests"></a>
## 🧪 9. TESTS

### 9.1 Configuration Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass): 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg): '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*): '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.test.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 9.2 Tests Unitaires (Components)

```javascript
// src/components/common/Button/Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled state correctly', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  test('renders with correct variant class', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveClass('btn-primary');
  });

  test('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 9.3 Tests d'Intégration (Services)

```javascript
// src/services/api/osintService.test.js
import osintService from './osintService';
import apiClient from './client';

jest.mock('./client');

describe('OSINT Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    test('fetches data successfully', async () => {
      const mockData = { users: [], posts: [] };
      apiClient.get.mockResolvedValue({ data: mockData });

      const result = await osintService.getData('tiktok', { limit: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/osint/tiktok', {
        params: { limit: 10 },
      });
      expect(result).toEqual(mockData);
    });

    test('handles API error', async () => {
      const error = new Error('API Error');
      apiClient.get.mockRejectedValue(error);

      await expect(osintService.getData('tiktok')).rejects.toThrow('API Error');
    });
  });

  describe('analyzeProfile', () => {
    test('analyzes profile successfully', async () => {
      const mockProfile = { username: 'test', followers: 1000 };
      apiClient.post.mockResolvedValue({ data: mockProfile });

      const result = await osintService.analyzeProfile('tiktok', 'test');

      expect(apiClient.post).toHaveBeenCalledWith('/osint/tiktok/analyze', {
        username: 'test',
      });
      expect(result).toEqual(mockProfile);
    });
  });
});
```

### 9.4 Tests E2E (Cypress)

```javascript
// cypress/e2e/authentication.cy.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('admin@aura-osint.com');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('wrong@email.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Identifiants invalides');
  });

  it('should redirect to dashboard if already authenticated', () => {
    cy.login('admin@aura-osint.com', 'SecurePassword123!');
    cy.visit('/auth/login');
    cy.url().should('include', '/dashboard');
  });
});
```

```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('auth_token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});
```

### 9.5 Scripts de Test

```json
// package.json - scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    "test:all": "npm run test:coverage && npm run test:e2e:headless"
  }
}
```

---

<a name="performance"></a>
## ⚡ 10. PERFORMANCE

### 10.1 Code Splitting & Lazy Loading

```javascript
// src/routes.js
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load des pages
const Dashboard = lazy(() => import('./views/Dashboard/Dashboard'));
const TikTokAnalyzer = lazy(() => import('./views/OSINT/TikTokAnalyzer'));
const ForensicTimeline = lazy(() => import('./views/Forensic/ForensicTimeline'));
const RAGExplorer = lazy(() => import('./views/RAG/RAGExplorer'));

const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/osint/tiktok" element={<TikTokAnalyzer />} />
      <Route path="/forensic" element={<ForensicTimeline />} />
      <Route path="/rag" element={<RAGExplorer />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
```

### 10.2 Optimisation des Rendus

```javascript
// Utiliser React.memo pour éviter re-renders inutiles
import React, { memo } from 'react';

const MetricsCard = memo(({ title, value, icon, trend }) => {
  return (
    <div className="metrics-card">
      <h3>{title}</h3>
      <p>{value}</p>
      <span>{trend}</span>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - ne re-render que si value change
  return prevProps.value === nextProps.value;
});

export default MetricsCard;
```

```javascript
// Utiliser useMemo pour calculs coûteux
import { useMemo } from 'react';

const DataAnalysis = ({ rawData }) => {
  const processedData = useMemo(() => {
    // Calcul coûteux
    return rawData
      .filter(item => item.active)
      .map(item => complexTransformation(item))
      .sort((a, b) => b.score - a.score);
  }, [rawData]); // Recalcule seulement si rawData change

  return <DataTable data={processedData} />;
};
```

```javascript
// Utiliser useCallback pour fonctions dans deps
import { useCallback } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const handleDelete = useCallback((userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []); // Fonction stable, ne change jamais

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onDelete={handleDelete} 
        />
      ))}
    </div>
  );
};
```

### 10.3 Optimisation des Images

```javascript
// src/components/common/OptimizedImage/OptimizedImage.jsx
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const OptimizedImage = ({ src, alt, width, height, className }) => {
  const [error, setError] = useState(false);

  if (error) {
    return <div className="image-placeholder">Image non disponible</div>;
  }

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      effect="blur"
      onError={() => setError(true)}
      threshold={100}
    />
  );
};

export default OptimizedImage;
```

### 10.4 Debounce & Throttle

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Utilisation
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Appel API avec le terme recherché
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher..."
    />
  );
};
```

```javascript
// src/utils/throttle.js
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Utilisation pour scroll events
const handleScroll = throttle(() => {
  console.log('Scrolling...');
}, 200);

window.addEventListener('scroll', handleScroll);
```

### 10.5 Virtualisation de Listes

```javascript
// Pour grandes listes - Utiliser react-window
import { FixedSizeList } from 'react-window';

const LargeDataList = ({ data }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {data[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={data.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

---

<a name="documentation"></a>
## 📚 11. DOCUMENTATION

### 11.1 JSDoc pour Fonctions

```javascript
/**
 * Récupère et analyse les données d'un profil utilisateur
 * 
 * @param {string} platform - La plateforme sociale (tiktok, facebook, instagram, twitter)
 * @param {string} username - Le nom d'utilisateur à analyser
 * @param {Object} options - Options de configuration
 * @param {boolean} [options.includeFollowers=false] - Inclure la liste des followers
 * @param {boolean} [options.includePosts=true] - Inclure les posts récents
 * @param {number} [options.limit=50] - Nombre maximum de posts à récupérer
 * 
 * @returns {Promise<Object>} Les données du profil analysé
 * @returns {string} return.username - Nom d'utilisateur
 * @returns {number} return.followersCount - Nombre de followers
 * @returns {number} return.score - Score d'influence (0-100)
 * @returns {Array<Object>} return.posts - Liste des posts
 * 
 * @throws {Error} Si la plateforme n'est pas supportée
 * @throws {Error} Si le profil n'existe pas
 * 
 * @example
 * const profile = await analyzeUserProfile('tiktok', 'username123', {
 *   includeFollowers: true,
 *   limit: 100
 * });
 */
async function analyzeUserProfile(platform, username, options = {}) {
  // Implementation
}
```

### 11.2 README des Composants

```markdown
<!-- src/components/common/DataTable/README.md -->

# DataTable Component

Table de données avancée avec pagination, tri, filtres et export.

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| data | Array | [] | Yes | Données à afficher |
| columns | Array | [] | Yes | Configuration des colonnes |
| pagination | boolean | true | No | Activer la pagination |
| pageSize | number | 10 | No | Nombre d'éléments par page |
| sortable | boolean | true | No | Activer le tri |
| filterable | boolean | false | No | Activer les filtres |
| exportable | boolean | false | No | Activer l'export |
| onRowClick | function | null | No | Callback au clic sur une ligne |
| loading | boolean | false | No | État de chargement |

## Utilisation

```jsx
import DataTable from '@/components/common/DataTable';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true, filterable: true },
  { key: 'email', label: 'Email' },
  { 
    key: 'actions', 
    label: 'Actions',
    render: (row) => (
      <Button onClick={() => handleEdit(row)}>Éditer</Button>
    )
  }
];

<DataTable
  data={users}
  columns={columns}
  pagination
  pageSize={20}
  sortable
  filterable
  exportable
  onRowClick={(row) => console.log(row)}
/>
```

## Exemples

### Table simple
```jsx
<DataTable data={simpleData} columns={simpleColumns} />
```

### Table avec actions
```jsx
const columnsWithActions = [
  ...columns,
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <>
        <Button onClick={() => handleView(row)}>Voir</Button>
        <Button onClick={() => handleDelete(row)}>Supprimer</Button>
      </>
    )
  }
];
```

## Styling

Le composant utilise des classes CSS modulaires. Pour personnaliser :

```scss
.data-table {
  // Vos styles
}
```

## Tests

```bash
npm test -- DataTable.test.js
```
```

### 11.3 Documentation API

```markdown
<!-- docs/API.md -->

# AURA OSINT - Documentation API

## Base URL

```
Production: https://api.aura-osint.com/api/v1
Staging: https://staging-api.aura-osint.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

Toutes les requêtes (sauf login/register) nécessitent un token JWT :

```http
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Connexion utilisateur

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/logout
Déconnexion

**Response:**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### OSINT Operations

#### GET /osint/:platform
Récupère les données OSINT

**Parameters:**
- `platform`: tiktok | facebook | instagram | twitter
- `username`: (query) Nom d'utilisateur à analyser
- `limit`: (query) Nombre de résultats (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "username": "example",
      "followers": 10000,
      "posts": 250
    },
    "posts": [...]
  }
}
```

### Forensic Analysis

#### POST /forensic/timeline
Crée une timeline forensique

**Request:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "sources": ["tiktok", "facebook"],
  "filters": {}
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Paramètres invalides |
| 401 | Unauthorized - Token manquant/invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource introuvable |
| 429 | Too Many Requests - Rate limit dépassé |
| 500 | Internal Server Error |

## Rate Limiting

- 100 requêtes / heure pour les utilisateurs standard
- 1000 requêtes / heure pour les comptes premium
```

---

<a name="deployment"></a>
## 🚀 12. DÉPLOIEMENT

### 12.1 Build Production

```bash
# Build optimisé
npm run build

# Analyse du bundle
npm run build && npx source-map-explorer 'build/static/js/*.js'

# Variables d'environnement production
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.aura-osint.com/api/v1
```

### 12.2 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - aura-network

networks:
  aura-network:
    driver: bridge
```

### 12.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          REACT_APP_WS_URL: ${{ secrets.WS_URL }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
      
      - name: Deploy to Production
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
      
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment completed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 12.4 Environnements de Déploiement

```bash
# Script de déploiement - deploy.sh
#!/bin/bash

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./deploy.sh [development|staging|production]"
  exit 1
fi

echo "🚀 Déploiement en environnement: $ENVIRONMENT"

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
  export $(cat .env.$ENVIRONMENT | xargs)
else
  echo "❌ Fichier .env.$ENVIRONMENT introuvable"
  exit 1
fi

# Run tests
echo "🧪 Exécution des tests..."
npm run test:coverage

if [ $? -ne 0 ]; then
  echo "❌ Tests échoués. Annulation du déploiement."
  exit 1
fi

# Build
echo "📦 Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build échoué. Annulation du déploiement."
  exit 1
fi

# Deploy
echo "🌐 Déploiement..."
case $ENVIRONMENT in
  development)
    echo "Déploiement sur serveur de développement..."
    rsync -avz --delete build/ dev-server:/var/www/aura-dev/
    ;;
  staging)
    echo "Déploiement sur serveur de staging..."
    rsync -avz --delete build/ staging-server:/var/www/aura-staging/
    ;;
  production)
    echo "Déploiement sur serveur de production..."
    # Backup before deploy
    ssh prod-server "cp -r /var/www/aura-prod /var/www/aura-prod-backup-$(date +%Y%m%d%H%M%S)"
    rsync -avz --delete build/ prod-server:/var/www/aura-prod/
    ;;
  *)
    echo "❌ Environnement invalide"
    exit 1
    ;;
esac

echo "✅ Déploiement terminé avec succès!"

# Health check
echo "🏥 Vérification de santé..."
sleep 5
curl -f $REACT_APP_API_URL/health || echo "⚠️  Health check échoué"

echo "🎉 Déploiement complet!"
```

### 12.5 Monitoring & Logging

```javascript
// src/utils/logger.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry (Production only)
if (process.env.REACT_APP_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.REACT_APP_ENV,
  });
}

class Logger {
  constructor() {
    this.enableLogs = process.env.REACT_APP_ENABLE_LOGS === 'true';
  }

  info(message, data = {}) {
    if (this.enableLogs) {
      console.log(`[INFO] ${message}`, data);
    }
    this.sendToBackend('info', message, data);
  }

  warn(message, data = {}) {
    console.warn(`[WARN] ${message}`, data);
    this.sendToBackend('warn', message, data);
  }

  error(message, error = {}) {
    console.error(`[ERROR] ${message}`, error);
    
    if (process.env.REACT_APP_ENV === 'production') {
      Sentry.captureException(error, {
        extra: { message },
      });
    }
    
    this.sendToBackend('error', message, error);
  }

  debug(message, data = {}) {
    if (this.enableLogs && process.env.REACT_APP_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  sendToBackend(level, message, data) {
    // Envoyer les logs au backend pour analyse
    if (process.env.REACT_APP_ENV === 'production') {
      fetch(`${process.env.REACT_APP_API_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(err => console.error('Failed to send log:', err));
    }
  }

  // Performance monitoring
  performance(name, duration) {
    if (this.enableLogs) {
      console.log(`[PERF] ${name}: ${duration}ms`);
    }
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: duration,
        event_category: 'Performance',
      });
    }
  }
}

export const logger = new Logger();
```

```javascript
// src/utils/analytics.js
class Analytics {
  constructor() {
    this.enabled = process.env.REACT_APP_ENV === 'production';
  }

  // Track page view
  pageView(path) {
    if (this.enabled && window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_ID, {
        page_path: path,
      });
    }
  }

  // Track event
  event(action, category, label, value) {
    if (this.enabled && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }

  // Track user
  identify(userId, traits = {}) {
    if (this.enabled && window.gtag) {
      window.gtag('set', 'user_id', userId);
      window.gtag('set', 'user_properties', traits);
    }
  }

  // Track error
  trackError(error, errorInfo) {
    this.event('error', 'Application Error', error.message, 0);
  }
}

export const analytics = new Analytics();
```

---

## 📊 13. MÉTRIQUES & KPIs

### 13.1 Métriques de Performance

```javascript
// src/utils/performanceMonitoring.js
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: null,  // First Contentful Paint
      lcp: null,  // Largest Contentful Paint
      fid: null,  // First Input Delay
      cls: null,  // Cumulative Layout Shift
      ttfb: null, // Time to First Byte
    };
  }

  // Mesurer les Core Web Vitals
  measureWebVitals() {
    if ('PerformanceObserver' in window) {
      // FCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcp = entries[0];
        this.metrics.fcp = fcp.startTime;
        this.reportMetric('FCP', fcp.startTime);
      }).observe({ entryTypes: ['paint'] });

      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcp = entries[entries.length - 1];
        this.metrics.lcp = lcp.renderTime || lcp.loadTime;
        this.reportMetric('LCP', this.metrics.lcp);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fid = entries[0];
        this.metrics.fid = fid.processingStart - fid.startTime;
        this.reportMetric('FID', this.metrics.fid);
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
          }
        }
        this.reportMetric('CLS', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Mesurer le temps de chargement d'une page
  measurePageLoad(pageName) {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    
    if (navigationTiming) {
      const metrics = {
        dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
        tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
        ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        download: navigationTiming.responseEnd - navigationTiming.responseStart,
        domInteractive: navigationTiming.domInteractive - navigationTiming.responseEnd,
        domComplete: navigationTiming.domComplete - navigationTiming.domInteractive,
        loadComplete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
      };

      this.reportMetric(`PageLoad_${pageName}`, metrics);
      return metrics;
    }
  }

  // Mesurer une action utilisateur
  measureUserAction(actionName, callback) {
    const startTime = performance.now();
    
    const result = callback();
    
    if (result instanceof Promise) {
      return result.then((res) => {
        const duration = performance.now() - startTime;
        this.reportMetric(`Action_${actionName}`, duration);
        return res;
      });
    } else {
      const duration = performance.now() - startTime;
      this.reportMetric(`Action_${actionName}`, duration);
      return result;
    }
  }

  // Reporter les métriques
  reportMetric(name, value) {
    logger.performance(name, value);
    
    // Envoyer au backend
    if (process.env.REACT_APP_ENV === 'production') {
      fetch(`${process.env.REACT_APP_API_URL}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          value,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      }).catch(err => console.error('Failed to report metric:', err));
    }
  }

  // Obtenir un résumé des métriques
  getSummary() {
    return {
      ...this.metrics,
      score: this.calculateScore(),
    };
  }

  // Calculer un score de performance (0-100)
  calculateScore() {
    const weights = {
      fcp: 0.15,
      lcp: 0.25,
      fid: 0.25,
      cls: 0.15,
      ttfb: 0.20,
    };

    let score = 0;
    
    // FCP: Good < 1800ms, Poor > 3000ms
    if (this.metrics.fcp) {
      score += weights.fcp * (this.metrics.fcp < 1800 ? 100 : 
                              this.metrics.fcp < 3000 ? 50 : 0);
    }

    // LCP: Good < 2500ms, Poor > 4000ms
    if (this.metrics.lcp) {
      score += weights.lcp * (this.metrics.lcp < 2500 ? 100 : 
                              this.metrics.lcp < 4000 ? 50 : 0);
    }

    // FID: Good < 100ms, Poor > 300ms
    if (this.metrics.fid) {
      score += weights.fid * (this.metrics.fid < 100 ? 100 : 
                              this.metrics.fid < 300 ? 50 : 0);
    }

    // CLS: Good < 0.1, Poor > 0.25
    if (this.metrics.cls !== null) {
      score += weights.cls * (this.metrics.cls < 0.1 ? 100 : 
                              this.metrics.cls < 0.25 ? 50 : 0);
    }

    return Math.round(score);
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

### 13.2 Objectifs de Performance

```javascript
// src/config/performanceTargets.js
export const PERFORMANCE_TARGETS = {
  // Core Web Vitals
  fcp: {
    good: 1800,      // ms
    needsImprovement: 3000,
    poor: Infinity,
  },
  lcp: {
    good: 2500,
    needsImprovement: 4000,
    poor: Infinity,
  },
  fid: {
    good: 100,
    needsImprovement: 300,
    poor: Infinity,
  },
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: Infinity,
  },
  
  // Custom metrics
  apiResponseTime: {
    good: 500,
    needsImprovement: 1000,
    poor: Infinity,
  },
  bundleSize: {
    good: 500 * 1024,  // 500KB
    needsImprovement: 1000 * 1024,  // 1MB
    poor: Infinity,
  },
  
  // Lighthouse scores
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 90,
};
```

---

## 🔧 14. OUTILS DE DÉVELOPPEMENT

### 14.1 VS Code Configuration

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.validate": false,
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "wix.vscode-import-cost",
    "eamodio.gitlens",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 14.2 Snippets Utiles

```json
// .vscode/snippets.code-snippets
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "import PropTypes from 'prop-types';",
      "",
      "const ${1:ComponentName} = ({ ${2:props} }) => {",
      "  return (",
      "    <div>",
      "      ${3:content}",
      "    </div>",
      "  );",
      "};",
      "",
      "${1:ComponentName}.propTypes = {",
      "  ${4:propName}: PropTypes.${5:string},",
      "};",
      "",
      "export default ${1:ComponentName};",
      ""
    ],
    "description": "React Functional Component with PropTypes"
  },
  
  "React Custom Hook": {
    "prefix": "uch",
    "body": [
      "import { useState, useEffect } from 'react';",
      "",
      "export const use${1:HookName} = (${2:params}) => {",
      "  const [${3:state}, set${3:State}] = useState(${4:initialValue});",
      "",
      "  useEffect(() => {",
      "    ${5:// Effect logic}",
      "  }, [${6:dependencies}]);",
      "",
      "  return { ${3:state}, set${3:State} };",
      "};",
      ""
    ],
    "description": "Custom React Hook"
  },
  
  "API Service Method": {
    "prefix": "apisvc",
    "body": [
      "/**",
      " * ${1:Description}",
      " * @param {${2:type}} ${3:param} - ${4:Description}",
      " * @returns {Promise<${5:ReturnType}>}",
      " */",
      "async ${6:methodName}(${3:param}) {",
      "  try {",
      "    const response = await apiClient.${7:get}('${8:/endpoint}', {",
      "      ${9:config}",
      "    });",
      "    return response.data;",
      "  } catch (error) {",
      "    logger.error('${10:Error message}:', error);",
      "    throw error;",
      "  }",
      "}",
      ""
    ],
    "description": "API Service Method"
  }
}
```

### 14.3 Scripts NPM Utiles

```json
// package.json - scripts complets
{
  "scripts": {
    // Development
    "start": "react-scripts start",
    "dev": "REACT_APP_ENV=development react-scripts start",
    
    // Build
    "build": "react-scripts build",
    "build:analyze": "npm run build && source-map-explorer 'build/static/js/*.js'",
    "build:staging": "REACT_APP_ENV=staging react-scripts build",
    "build:prod": "REACT_APP_ENV=production react-scripts build",
    
    // Testing
    "test": "react-scripts test",
    "test:watch": "react-scripts test --watch",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    
    // Linting & Formatting
    "lint": "eslint src/**/*.{js,jsx}",
    "lint:fix": "eslint src/**/*.{js,jsx} --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,scss,md}\"",
    
    // Pre-commit hooks
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    
    // Deployment
    "deploy:dev": "./deploy.sh development",
    "deploy:staging": "./deploy.sh staging",
    "deploy:prod": "./deploy.sh production",
    
    // Utilities
    "clean": "rm -rf build node_modules package-lock.json",
    "reinstall": "npm run clean && npm install",
    "check-updates": "npx npm-check-updates",
    "update-deps": "npx npm-check-updates -u && npm install"
  }
}
```

### 14.4 Git Hooks (Husky)

```json
// package.json - husky & lint-staged
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test:coverage && npm run build"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "src/**/*.{json,css,scss,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation
        'style',    // Formatage
        'refactor', // Refactorisation
        'test',     // Tests
        'chore',    // Maintenance
        'perf',     // Performance
        'ci',       // CI/CD
        'revert',   // Revert
      ],
    ],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 100],
  },
};
```

---

## 📞 15. SUPPORT & COMMUNICATION

### 15.1 Canaux de Communication

```markdown
## Communication d'Équipe

### Daily Standup (15 min)
- **Quand**: Chaque jour à 9h30
- **Format**: Slack call ou présence
- **Questions**: 
  - Qu'ai-je fait hier?
  - Que vais-je faire aujourd'hui?
  - Y a-t-il des blocages?

### Sprint Planning (2h)
- **Quand**: Début de chaque sprint (2 semaines)
- **Participants**: Toute l'équipe dev
- **Objectif**: Planifier les tâches du sprint

### Code Review
- **Délai**: 24h maximum
- **Process**: 
  1. Créer PR avec description détaillée
  2. Assigner 2 reviewers minimum
  3. Résoudre tous les commentaires
  4. Obtenir 2 approvals minimum
  5. Merger

### Réunion Technique (1h)
- **Quand**: Mercredi 14h
- **Objectif**: Discussions techniques, décisions d'architecture

### Retrospective (1h)
- **Quand**: Fin de chaque sprint
- **Format**: Start/Stop/Continue
```

### 15.2 Slack Channels

```
#aura-dev-general      - Discussions générales
#aura-dev-frontend     - Frontend React
#aura-dev-backend      - Backend Node.js
#aura-dev-ops          - DevOps & Infrastructure
#aura-bug-reports      - Signalement de bugs
#aura-deployments      - Notifications de déploiement
#aura-ci-cd            - CI/CD notifications
#aura-random           - Off-topic
```

### 15.3 Documentation Interne

```
Confluence / Notion:
├── 📖 Wiki Technique
│   ├── Architecture
│   ├── API Documentation
│   ├── Database Schema
│   └── Security Guidelines
│
├── 📝 Procédures
│   ├── Onboarding
│   ├── Deployment
│   ├── Incident Response
│   └── Code Review Guidelines
│
├── 🎯 Product Roadmap
│   ├── Current Sprint
│   ├── Backlog
│   └── Future Features
│
└── 📊 Metrics & KPIs
    ├── Performance Metrics
    ├── User Analytics
    └── System Health
```

---

## 🚨 16. TROUBLESHOOTING

### 16.1 Problèmes Courants

```markdown
## Problème: npm install échoue

**Symptômes**: Erreurs pendant l'installation des dépendances

**Solutions**:
1. Supprimer node_modules et package-lock.json
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Vider le cache npm
   ```bash
   npm cache clean --force
   npm install
   ```

3. Utiliser une version spécifique de Node
   ```bash
   nvm install 18
   nvm use 18
   npm install
   ```

---

## Problème: CORS errors en développement

**Symptômes**: Requêtes API bloquées par CORS

**Solution**: Ajouter proxy dans package.json
```json
{
  "proxy": "http://localhost:3000"
}
```

Ou configurer setupProxy.js:
```javascript
// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};
```

---

## Problème: Memory leak / Performance dégradée

**Symptômes**: Application ralentit après utilisation prolongée

**Solutions**:
1. Vérifier les cleanup dans useEffect
   ```javascript
   useEffect(() => {
     const subscription = subscribeToData();
     return () => subscription.unsubscribe(); // CLEANUP
   }, []);
   ```

2. Utiliser React.memo pour éviter re-renders
3. Vérifier les WebSocket connections non fermées
4. Utiliser Chrome DevTools → Performance tab

---

## Problème: Build production échoue

**Symptômes**: npm run build retourne une erreur

**Solutions**:
1. Vérifier les variables d'environnement
2. Vérifier la taille du bundle
   ```bash
   npm run build:analyze
   ```
3. Corriger les warnings ESLint
   ```bash
   npm run lint:fix
   ```
4. Supprimer et réinstaller les dépendances
```

### 16.2 Debug Tools

```javascript
// src/utils/debug.js
export const debugTools = {
  // Logger les props d'un composant
  logProps: (componentName, props) => {
    if (process.env.REACT_APP_ENV === 'development') {
      console.group(`${componentName} Props`);
      console.table(props);
      console.groupEnd();
    }
  },

  // Logger les re-renders
  useWhyDidYouUpdate: (name, props) => {
    const previousProps = useRef();

    useEffect(() => {
      if (previousProps.current) {
        const allKeys = Object.keys({ ...previousProps.current, ...props });
        const changedProps = {};

        allKeys.forEach(key => {
          if (previousProps.current[key] !== props[key]) {
            changedProps[key] = {
              from: previousProps.current[key],
              to: props[key],
            };
          }
        });

        if (Object.keys(changedProps).length > 0) {
          console.log('[why-did-you-update]', name, changedProps);
        }
      }

      previousProps.current = props;
    });
  },

  // Mesurer le temps de render
  measureRenderTime: (componentName, callback) => {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  },
};
```

---

## ✅ 17. CHECKLIST AVANT PRODUCTION

```markdown
## 🔍 Code Quality
- [ ] Tous les tests passent (unit + integration + e2e)
- [ ] Coverage > 70%
- [ ] Aucun warning ESLint
- [ ] Code formaté avec Prettier
- [ ] Aucun console.log oublié
- [ ] Aucun TODO/FIXME critique
- [ ] PropTypes définis pour tous les composants
- [ ] Code review approuvé par 2+ développeurs

## 🔐 Sécurité
- [ ] Toutes les entrées utilisateur sont validées/sanitizées
- [ ] Tokens JWT stockés de manière sécurisée
- [ ] HTTPS activé
- [ ] CSP headers configurés
- [ ] XSS protection en place
- [ ] CORS configuré correctement
- [ ] Rate limiting implémenté
- [ ] Secrets/API keys dans variables d'environnement
- [ ] 2FA activé pour comptes admin
- [ ] Audit de sécurité effectué

## ⚡ Performance
- [ ] Bundle size < 500KB (gzipped)
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Code splitting implémenté
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals dans les targets
- [ ] Cache strategy définie
- [ ] CDN configuré
- [ ] Compression Gzip/Brotli activée

## 📊 Monitoring
- [ ] Sentry configuré
- [ ] Google Analytics configuré
- [ ] Logs centralisés
- [ ] Alertes configurées
- [ ] Health checks en place
- [ ] Uptime monitoring actif

## 📝 Documentation
- [ ] README à jour
- [ ] API documentation complète
- [ ] Changelog mis à jour
- [ ] Procédures de déploiement documentées
- [ ] Runbooks pour incidents

## 🚀 Deployment
- [ ] Variables d'environnement production configurées
- [ ] Backup effectué
- [ ] Rollback plan défini
- [ ] Smoke tests préparés
- [ ] Communication équipe planifiée
- [ ] Maintenance window planifiée (si nécessaire)

## 📱 Compatibility
- [ ] Testé sur Chrome, Firefox, Safari, Edge
- [ ] Testé sur mobile (iOS, Android)
- [ ] Responsive design vérifié
- [ ] Accessibilité (A11y) testée

##


































📱 18. COMPATIBILITÉ & ACCESSIBILITÉ
18.1 Browser Support Matrix
// package.json - browserslist
{
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all",
      "chrome >= 90",
      "firefox >= 88",
      "safari >= 14",
      "edge >= 90"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
18.2 Accessibilité (WCAG 2.1 Level AA)
// src/components/common/AccessibleButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AccessibleButton = ({ 
  children, 
  onClick, 
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  loading = false,
  variant = 'primary',
  ...props 
}) => {
  const handleKeyPress = (e) => {
    // Support Enter et Space pour activation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-${variant} ${disabled || loading ? 'btn-disabled' : ''}`}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      disabled={disabled || loading}
      aria-label={ariaLabel || children}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {loading && (
        <span 
          className="spinner" 
          role="status" 
          aria-label="Chargement en cours"
        />
      )}
      <span aria-hidden={loading}>{children}</span>
    </button>
  );
};

AccessibleButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
};

export default AccessibleButton;
18.3 Keyboard Navigation
// src/hooks/useKeyboardNavigation.js
import { useEffect, useRef } from 'react';

export const useKeyboardNavigation = (itemsRef, onSelect) => {
  const currentIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const items = itemsRef.current;
      if (!items || items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndex.current = Math.min(currentIndex.current + 1, items.length - 1);
          items[currentIndex.current]?.focus();
          break;

        case 'ArrowUp':
          e.preventDefault();
          currentIndex.current = Math.max(currentIndex.current - 1, 0);
          items[currentIndex.current]?.focus();
          break;

        case 'Home':
          e.preventDefault();
          currentIndex.current = 0;
          items[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          currentIndex.current = items.length - 1;
          items[items.length - 1]?.focus();
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(currentIndex.current);
          break;

        case 'Escape':
          e.preventDefault();
          document.activeElement?.blur();
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [itemsRef, onSelect]);

  return { currentIndex: currentIndex.current };
};
18.4 Screen Reader Support
// src/components/common/LiveRegion.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant pour annoncer des mises à jour aux lecteurs d'écran
 */
const LiveRegion = ({ message, politeness = 'polite', clearOnUnmount = true }) => {
  const regionRef = useRef(null);

  useEffect(() => {
    if (regionRef.current && message) {
      // Forcer l'annonce en changeant temporairement le contenu
      regionRef.current.textContent = '';
      setTimeout(() => {
        regionRef.current.textContent = message;
      }, 100);
    }
  }, [message]);

  useEffect(() => {
    return () => {
      if (clearOnUnmount && regionRef.current) {
        regionRef.current.textContent = '';
      }
    };
  }, [clearOnUnmount]);

  return (
    <div
      ref={regionRef}
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

LiveRegion.propTypes = {
  message: PropTypes.string,
  politeness: PropTypes.oneOf(['polite', 'assertive']),
  clearOnUnmount: PropTypes.bool,
};

export default LiveRegion;

---

## 🔄 19. DOCKER & CONTAINERISATION

### 19.1 Dockerfile Multi-stage

```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade

# Copy built app
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 19.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
    networks:
      - aura-network
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4010:4010"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/logs:/app/logs
    restart: unless-stopped
    networks:
      - aura-network
    depends_on:
      - database
      - redis

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aura_osint
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - aura-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - aura-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    networks:
      - aura-network
    depends_on:
      - frontend

volumes:
  postgres_data:
  redis_data:

networks:
  aura-network:
    driver: bridge
```

### 19.3 Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.aura-osint.com;" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri $uri/ =404;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:4010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

## 🚀 20. CI/CD PIPELINE AVANCÉ

### 20.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  security:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Run npm audit
        run: npm audit --audit-level=high

  build:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
          REACT_APP_WS_URL: ${{ secrets.REACT_APP_WS_URL }}
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build/
          retention-days: 30

  docker:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/aura-osint
            docker-compose pull
            docker-compose up -d
            docker system prune -f
      
      - name: Health check
        run: |
          sleep 30
          curl -f ${{ secrets.PRODUCTION_URL }}/health || exit 1
      
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'AURA OSINT deployment completed successfully! 🚀'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 20.2 Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm start',
      startServerReadyPattern: 'compiled successfully',
      startServerReadyTimeout: 60000,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

## 📊 21. MONITORING & OBSERVABILITÉ

### 21.1 Prometheus Metrics

```javascript
// src/utils/metrics.js
class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  // Counter metrics
  incrementCounter(name, labels = {}) {
    const key = this.getMetricKey(name, labels);
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
  }

  // Histogram metrics
  recordHistogram(name, value, labels = {}) {
    const key = this.getMetricKey(name, labels);
    const current = this.metrics.get(key) || [];
    current.push({ value, timestamp: Date.now() });
    this.metrics.set(key, current);
  }

  // Gauge metrics
  setGauge(name, value, labels = {}) {
    const key = this.getMetricKey(name, labels);
    this.metrics.set(key, value);
  }

  getMetricKey(name, labels) {
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    return labelStr ? `${name}{${labelStr}}` : name;
  }

  // Export metrics in Prometheus format
  exportMetrics() {
    const lines = [];
    
    for (const [key, value] of this.metrics.entries()) {
      if (Array.isArray(value)) {
        // Histogram
        const sum = value.reduce((acc, item) => acc + item.value, 0);
        const count = value.length;
        lines.push(`${key}_sum ${sum}`);
        lines.push(`${key}_count ${count}`);
      } else {
        // Counter or Gauge
        lines.push(`${key} ${value}`);
      }
    }
    
    return lines.join('\n');
  }

  // Send metrics to backend
  async sendMetrics() {
    try {
      await fetch('/api/v1/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: this.exportMetrics(),
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }
}

export const metrics = new MetricsCollector();

// Usage examples
metrics.incrementCounter('osint_queries_total', { platform: 'tiktok' });
metrics.recordHistogram('osint_query_duration_ms', 1500, { platform: 'tiktok' });
metrics.setGauge('active_users', 42);
```

### 21.2 Error Tracking avec Sentry

```javascript
// src/utils/errorTracking.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/api\.aura-osint\.com/],
      }),
    ],
    tracesSampleRate: 0.1,
    environment: process.env.REACT_APP_ENV,
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = event.exception.values[0];
        if (error.type === 'ChunkLoadError') {
          return null; // Ignore chunk load errors
        }
      }
      return event;
    },
  });
}

export const captureError = (error, context = {}) => {
  console.error('Error captured:', error);
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        component: context.component,
        action: context.action,
      },
      extra: context,
    });
  }
};

export const captureMessage = (message, level = 'info', context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, level, {
      extra: context,
    });
  }
};

export const setUserContext = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};
```

---

## 🔐 22. SÉCURITÉ AVANCÉE

### 22.1 Content Security Policy (CSP)

```javascript
// src/utils/csp.js
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // À éviter, utiliser nonce en production
    'https://www.googletagmanager.com',
    'https://cdn.jsdelivr.net',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    'https://api.aura-osint.com',
    'wss://api.aura-osint.com',
    'https://sentry.io',
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [],
};

export const generateCSPHeader = () => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};
```

### 22.2 Input Sanitization

```javascript
// src/utils/sanitizer.js
import DOMPurify from 'dompurify';

class InputSanitizer {
  // Sanitize HTML content
  static sanitizeHTML(dirty, options = {}) {
    const defaultOptions = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ALLOW_DATA_ATTR: false,
      FORBID_SCRIPT: true,
    };

    return DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });
  }

  // Escape special characters
  static escapeHTML(str) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return str.replace(/[&<>"'/]/g, (char) => map[char]);
  }

  // Validate and sanitize URLs
  static sanitizeURL(url) {
    try {
      const parsed = new URL(url);
      
      // Only allow safe protocols
      if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
        return '';
      }
      
      return parsed.toString();
    } catch (error) {
      return '';
    }
  }

  // Remove SQL injection patterns
  static sanitizeSQL(input) {
    const sqlPatterns = [
      /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
      /(exec(\s|\+)+(s|x)p\w+)/i,
      /union.*select/i,
      /insert.*into/i,
      /delete.*from/i,
      /update.*set/i,
      /drop.*table/i,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        throw new Error('Potentially malicious input detected');
      }
    }

    return input;
  }

  // Sanitize file names
  static sanitizeFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }
}

export default InputSanitizer;
```

---

## 🧪 23. TESTS AVANCÉS

### 23.1 Tests de Performance

```javascript
// src/tests/performance/renderPerformance.test.js
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import Dashboard from '../views/Dashboard/Dashboard';

describe('Performance Tests', () => {
  test('Dashboard renders within performance budget', () => {
    const startTime = performance.now();
    
    render(<Dashboard />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('Large data set renders efficiently', () => {
    const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 100,
    }));

    const startTime = performance.now();
    
    render(<DataTable data={largeDataSet} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle large datasets within 200ms
    expect(renderTime).toBeLessThan(200);
  });
});
```

### 23.2 Tests de Sécurité

```javascript
// src/tests/security/xss.test.js
import { render, screen } from '@testing-library/react';
import InputSanitizer from '../../utils/sanitizer';
import SafeHTML from '../../components/common/SafeHTML';

describe('XSS Protection Tests', () => {
  test('should sanitize malicious script tags', () => {
    const maliciousInput = '<script>alert("XSS")</script><p>Safe content</p>';
    const sanitized = InputSanitizer.sanitizeHTML(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('<p>Safe content</p>');
  });

  test('should prevent javascript: URLs', () => {
    const maliciousURL = 'javascript:alert("XSS")';
    const sanitized = InputSanitizer.sanitizeURL(maliciousURL);
    
    expect(sanitized).toBe('');
  });

  test('SafeHTML component should render sanitized content', () => {
    const maliciousHTML = '<img src="x" onerror="alert(1)">Valid content';
    
    render(<SafeHTML html={maliciousHTML} />);
    
    expect(screen.getByText('Valid content')).toBeInTheDocument();
    expect(document.querySelector('img[onerror]')).toBeNull();
  });
});
```

---

## 📱 24. PROGRESSIVE WEB APP (PWA)

### 24.1 Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'aura-osint-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 24.2 Web App Manifest

```json
{
  "name": "AURA OSINT Advanced Ecosystem",
  "short_name": "AURA OSINT",
  "description": "Professional OSINT Platform for Advanced Intelligence Gathering",
  "start_url": "/dashboard",
  "display": "standalone",
  "theme_color": "#0056e0",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["security", "productivity", "utilities"],
  "screenshots": [
    {
      "src": "screenshots/desktop-dashboard.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "screenshots/mobile-dashboard.png",
      "sizes": "375x667",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

---

## 🎯 25. CONCLUSION & ROADMAP

### 25.1 Checklist de Déploiement Final

```markdown
## ✅ PRODUCTION READINESS CHECKLIST

### 🔍 Code Quality (100%)
- [x] Tests unitaires > 80% coverage
- [x] Tests E2E pour parcours critiques
- [x] ESLint 0 erreurs/warnings
- [x] TypeScript strict mode
- [x] Code review approuvé
- [x] Documentation complète

### 🔐 Sécurité (100%)
- [x] CSP headers configurés
- [x] XSS protection active
- [x] Input sanitization
- [x] JWT avec refresh tokens
- [x] Rate limiting implémenté
- [x] HTTPS forcé
- [x] Audit sécurité effectué

### ⚡ Performance (100%)
- [x] Lighthouse score > 90
- [x] Bundle size < 500KB
- [x] Code splitting optimisé
- [x] Images optimisées
- [x] CDN configuré
- [x] Compression activée

### 📊 Monitoring (100%)
- [x] Sentry configuré
- [x] Métriques Prometheus
- [x] Logs centralisés
- [x] Alertes configurées
- [x] Health checks
- [x] Uptime monitoring

### 🚀 Infrastructure (100%)
- [x] Docker containerisé
- [x] CI/CD pipeline
- [x] Backup automatique
- [x] Rollback plan
- [x] Load balancing
- [x] SSL certificates
```

### 25.2 Roadmap Technique

```markdown
## 🗺️ ROADMAP 2024-2025

### Q1 2024 - Foundation
- [x] Architecture de base
- [x] Authentification & autorisation
- [x] Interface utilisateur
- [x] API REST de base
- [x] Tests unitaires

### Q2 2024 - Core Features
- [ ] Modules OSINT complets
- [ ] Analyse forensique avancée
- [ ] RAG & IA intégrée
- [ ] WebSocket temps réel
- [ ] Export/Import données

### Q3 2024 - Advanced Features
- [ ] Machine Learning intégré
- [ ] Analyse prédictive
- [ ] Corrélation automatique
- [ ] API publique
- [ ] Plugins système

### Q4 2024 - Enterprise
- [ ] Multi-tenancy
- [ ] SSO/SAML
- [ ] Audit avancé
- [ ] Compliance GDPR
- [ ] White-label

### Q1 2025 - Innovation
- [ ] IA générative
- [ ] Blockchain integration
- [ ] Mobile app native
- [ ] Edge computing
- [ ] Quantum-ready crypto
```

### 25.3 Métriques de Succès

```javascript
// KPIs à surveiller
const SUCCESS_METRICS = {
  technical: {
    uptime: '> 99.9%',
    responseTime: '< 200ms P95',
    errorRate: '< 0.1%',
    deploymentFrequency: '> 1/day',
    leadTime: '< 1 hour',
    mttr: '< 15 minutes',
  },
  business: {
    userSatisfaction: '> 4.5/5',
    featureAdoption: '> 80%',
    dataAccuracy: '> 95%',
    investigationTime: '< 50% reduction',
    threatDetection: '> 90% accuracy',
  },
  security: {
    vulnerabilities: '0 critical',
    complianceScore: '100%',
    incidentResponse: '< 1 hour',
    dataBreaches: '0',
    auditScore: '> 95%',
  },
};
```

---

## 📚 26. RESSOURCES & RÉFÉRENCES

### 26.1 Documentation Technique

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Query**: https://tanstack.com/query/
- **Cypress**: https://www.cypress.io/
- **Docker**: https://docs.docker.com/
- **Nginx**: https://nginx.org/en/docs/

### 26.2 Sécurité & Compliance

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **GDPR Compliance**: https://gdpr.eu/
- **CSP Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **JWT Best Practices**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/

### 26.3 Performance & Monitoring

- **Web Vitals**: https://web.dev/vitals/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/

### 26.4 OSINT Resources

- **OSINT Framework**: https://osintframework.com/
- **Bellingcat**: https://www.bellingcat.com/
- **SANS OSINT**: https://www.sans.org/cyber-aces/

---

## 🏆 27. CRÉDITS & REMERCIEMENTS

### 27.1 Équipe de Développement

- **Lead Developer**: Sofiane Kaabache
- **Security Consultant**: [À définir]
- **DevOps Engineer**: [À définir]
- **UI/UX Designer**: [À définir]

### 27.2 Technologies Utilisées

- **Frontend**: React 18, TypeScript, Zustand
- **Backend**: Node.js, Express, PostgreSQL
- **Infrastructure**: Docker, Nginx, Redis
- **Monitoring**: Prometheus, Grafana, Sentry
- **CI/CD**: GitHub Actions, Docker Hub

### 27.3 Licence

```
MIT License

Copyright (c) 2024 AURA OSINT Advanced Ecosystem

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**🚀 AURA OSINT ADVANCED ECOSYSTEM - The Future of Intelligence Gathering**

*Développé avec ❤️ par l'équipe AURA OSINT*f } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant pour annoncer des mises à jour aux lecteurs d'écran
 */
const LiveRegion = ({ message, politeness = 'polite', clearOnUnmount = true }) => {
  const regionRef = useRef(null);

  useEffect(() => {
    if (regionRef.current && message) {
      // Forcer l'annonce en changeant temporairement le contenu
      regionRef.current.textContent = '';
      setTimeout(() => {
        regionRef.current.textContent = message;
      }, 100);
    }
  }, [message]);

  useEffect(() => {
    return () => {
      if (clearOnUnmount && regionRef.current) {
        regionRef.current.textContent = '';
      }
    };
  }, [clearOnUnmount]);

  return (
    <div
      ref={regionRef}
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

LiveRegion.propTypes = {
  message: PropTypes.string,
  politeness: PropTypes.oneOf(['polite', 'assertive']),
  clearOnUnmount: PropTypes.bool,
};

export default LiveRegion;
18.5 Color Contrast & Theme
// src/styles/accessibility.scss
// WCAG AA: Ratio minimum 4.5:1 pour texte normal, 3:1 pour texte large

$colors-accessible: (
  'primary-text': #1a1a1a,      // Ratio 13.5:1 sur fond blanc
  'secondary-text': #4a4a4a,    // Ratio 8.5:1 sur fond blanc
  'disabled-text': #767676,      // Ratio 4.5:1 sur fond blanc (minimum AA)
  'link': #0056b3,               // Ratio 5.9:1 sur fond blanc
  'error': #c30000,              // Ratio 6.5:1 sur fond blanc
  'success': #006600,            // Ratio 7.2:1 sur fond blanc
  'warning': #9c5a00,            // Ratio 5.1:1 sur fond blanc
);

// Utilitaire pour focus visible
.focus-visible {
  outline: 3px solid #4c9aff;
  outline-offset: 2px;
  transition: outline 0.2s ease;
}

// Skip to main content
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 10000;

  &:focus {
    top: 0;
  }
}

// Screen reader only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

🌐 19. INTERNATIONALISATION (i18n)
19.1 Configuration i18next
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import des traductions
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationES from './locales/es/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  es: { translation: translationES },
  ar: { translation: translationAR },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
19.2 Structure des Traductions
// src/i18n/locales/fr/translation.json
{
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur s'est produite",
    "success": "Opération réussie",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "edit": "Modifier",
    "search": "Rechercher",
    "filter": "Filtrer",
    "export": "Exporter",
    "import": "Importer"
  },
  
  "auth": {
    "login": {
      "title": "Connexion à AURA OSINT",
      "email": "Adresse email",
      "password": "Mot de passe",
      "remember": "Se souvenir de moi",
      "forgot": "Mot de passe oublié ?",
      "submit": "Se connecter",
      "errors": {
        "invalid": "Email ou mot de passe incorrect",
        "locked": "Compte verrouillé. Contactez l'administrateur",
        "network": "Erreur de connexion. Vérifiez votre connexion internet"
      }
    },
    "register": {
      "title": "Créer un compte",
      "fullName": "Nom complet",
      "email": "Adresse email",
      "password": "Mot de passe",
      "confirmPassword": "Confirmer le mot de passe",
      "terms": "J'accepte les <1>conditions d'utilisation</1>",
      "submit": "S'inscrire",
      "success": "Compte créé avec succès. Vérifiez votre email."
    }
  },

  "dashboard": {
    "title": "Tableau de bord",
    "welcome": "Bienvenue, {{name}}",
    "stats": {
      "activeInvestigations": "Enquêtes actives",
      "totalTargets": "Cibles surveillées",
      "alertsToday": "Alertes aujourd'hui",
      "dataProcessed": "Données traitées"
    },
    "quickActions": {
      "title": "Actions rapides",
      "newInvestigation": "Nouvelle enquête",
      "runAnalysis": "Lancer une analyse",
      "generateReport": "Générer un rapport",
      "viewAlerts": "Voir les alertes"
    }
  },

  "osint": {
    "platforms": {
      "tiktok": "TikTok",
      "instagram": "Instagram",
      "facebook": "Facebook",
      "twitter": "Twitter / X",
      "linkedin": "LinkedIn"
    },
    "analyzer": {
      "title": "Analyseur {{platform}}",
      "username": "Nom d'utilisateur",
      "startAnalysis": "Démarrer l'analyse",
      "analyzing": "Analyse en cours...",
      "results": {
        "profile": "Informations du profil",
        "activity": "Activité récente",
        "connections": "Connexions",
        "engagement": "Engagement",
        "timeline": "Chronologie"
      }
    },
    "export": {
      "title": "Exporter les résultats",
      "format": "Format",
      "formats": {
        "json": "JSON",
        "csv": "CSV",
        "pdf": "PDF",
        "excel": "Excel"
      },
      "includeImages": "Inclure les images",
      "includeMetadata": "Inclure les métadonnées",
      "download": "Télécharger"
    }
  },

  "forensic": {
    "title": "Analyse Forensique",
    "upload": {
      "title": "Télécharger un fichier",
      "dropzone": "Glissez-déposez un fichier ou cliquez pour sélectionner",
      "supported": "Formats supportés: {{formats}}",
      "maxSize": "Taille max: {{size}}",
      "uploading": "Téléchargement en cours..."
    },
    "analysis": {
      "hashes": "Empreintes",
      "metadata": "Métadonnées",
      "strings": "Chaînes de caractères",
      "threats": "Menaces détectées",
      "timeline": "Chronologie des événements"
    }
  },

  "validation": {
    "required": "Ce champ est requis",
    "email": "Adresse email invalide",
    "minLength": "Minimum {{count}} caractères",
    "maxLength": "Maximum {{count}} caractères",
    "password": {
      "weak": "Mot de passe trop faible",
      "requirements": "Doit contenir: 8+ caractères, majuscule, minuscule, chiffre, caractère spécial"
    },
    "username": "Nom d'utilisateur invalide (alphanumériques, tirets, underscores uniquement)",
    "url": "URL invalide",
    "phone": "Numéro de téléphone invalide"
  },

  "errors": {
    "network": "Erreur réseau. Vérifiez votre connexion",
    "server": "Erreur serveur. Réessayez plus tard",
    "unauthorized": "Non autorisé. Veuillez vous reconnecter",
    "forbidden": "Accès refusé",
    "notFound": "Ressource introuvable",
    "timeout": "Délai d'attente dépassé",
    "unknown": "Une erreur inconnue s'est produite"
  },

  "date": {
    "today": "Aujourd'hui",
    "yesterday": "Hier",
    "thisWeek": "Cette semaine",
    "lastWeek": "Semaine dernière",
    "thisMonth": "Ce mois",
    "lastMonth": "Mois dernier",
    "custom": "Personnalisé"
  }
}
19.3 Hook d'Utilisation
// src/hooks/useTranslation.js
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useTranslation = (namespace = 'translation') => {
  const { t, i18n } = useI18nTranslation(namespace);

  const changeLanguage = useCallback(
    async (lng) => {
      try {
        await i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        
        // Mettre à jour l'attribut lang du HTML
        document.documentElement.lang = lng;
        
        // Support RTL pour langues arabes
        if (lng === 'ar') {
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.dir = 'ltr';
        }
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    },
    [i18n]
  );

  const formatDate = useCallback(
    (date, options = {}) => {
      return new Intl.DateTimeFormat(i18n.language, options).format(new Date(date));
    },
    [i18n.language]
  );

  const formatNumber = useCallback(
    (number, options = {}) => {
      return new Intl.NumberFormat(i18n.language, options).format(number);
    },
    [i18n.language]
  );

  const formatCurrency = useCallback(
    (amount, currency = 'EUR') => {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency,
      }).format(amount);
    },
    [i18n.language]
  );

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
    formatDate,
    formatNumber,
    formatCurrency,
  };
};
19.4 Composant de Sélection de Langue
// src/components/common/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Dropdown } from 'react-bootstrap';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useTranslation();

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <Dropdown className="language-selector">
      <Dropdown.Toggle variant="link" id="language-dropdown">
        <span className="flag">{currentLang.flag}</span>
        <span className="name">{currentLang.name}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        {LANGUAGES.map((lang) => (
          <Dropdown.Item
            key={lang.code}
            active={lang.code === currentLanguage}
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="flag">{lang.flag}</span>
            <span className="name">{lang.name}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSelector;

🔄 20. STATE MANAGEMENT AVANCÉ
20.1 Zustand Store (Alternative à Redux)
// src/store/osintStore.js
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import osintService from '../services/api/osintService';

export const useOSINTStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        investigations: [],
        currentInvestigation: null,
        targets: [],
        results: [],
        loading: false,
        error: null,
        filters: {
          platform: null,
          status: null,
          dateRange: null,
        },

        // Actions
        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
            state.loading = false;
          }),

        // Investigations
        fetchInvestigations: async () => {
          set({ loading: true, error: null });
          try {
            const data = await osintService.getInvestigations();
            set((state) => {
              state.investigations = data;
              state.loading = false;
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        createInvestigation: async (investigationData) => {
          set({ loading: true, error: null });
          try {
            const newInvestigation = await osintService.createInvestigation(investigationData);
            set((state) => {
              state.investigations.push(newInvestigation);
              state.currentInvestigation = newInvestigation;
              state.loading = false;
            });
            return newInvestigation;
          } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        updateInvestigation: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            const updated = await osintService.updateInvestigation(id, updates);
            set((state) => {
              const index = state.investigations.findIndex((inv) => inv.id === id);
              if (index !== -1) {
                state.investigations[index] = updated;
              }
              if (state.currentInvestigation?.id === id) {
                state.currentInvestigation = updated;
              }
              state.loading = false;
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        deleteInvestigation: async (id) => {
          set({ loading: true, error: null });
          try {
            await osintService.deleteInvestigation(id);
            set((state) => {
              state.investigations = state.investigations.filter((inv) => inv.id !== id);
              if (state.currentInvestigation?.id === id) {
                state.currentInvestigation = null;
              }
              state.loading = false;
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        setCurrentInvestigation: (investigation) =>
          set({ currentInvestigation: investigation }),

        // Targets
        addTarget: async (investigationId, targetData) => {
          set({ loading: true, error: null });
          try {
            const newTarget = await osintService.addTarget(investigationId, targetData);
            set((state) => {
              state.targets.push(newTarget);
              state.loading = false;
            });
            return newTarget;
          } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        removeTarget: async (targetId) => {
          set({ loading: true, error: null });
          try {
            await osintService.removeTarget(targetId);
            set((state) => {
              state.targets = state.targets.filter((t) => t.id !== targetId);
              state.loading = false;
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        // Results
        fetchResults: async (investigationId) => {
          set({ loading: true, error: null });
          try {
            const data = await osintService.getResults(investigationId);
            set({ results: data, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        addResult: (result) =>
          set((state) => {
            state.results.push(result);
          }),

        updateResult: (id, updates) =>
          set((state) => {
            const index = state.results.findIndex((r) => r.id === id);
            if (index !== -1) {
              state.results[index] = { ...state.results[index], ...updates };
            }
          }),

        // Filters
        setFilters: (filters) =>
          set((state) => {
            state.filters = { ...state.filters, ...filters };
          }),

        clearFilters: () =>
          set((state) => {
            state.filters = {
              platform: null,
              status: null,
              dateRange: null,
            };
          }),

        // Computed
        getFilteredResults: () => {
          const { results, filters } = get();
          return results.filter((result) => {
            if (filters.platform && result.platform !== filters.platform) return false;
            if (filters.status && result.status !== filters.status) return false;
            if (filters.dateRange) {
              const resultDate = new Date(result.createdAt);
              const { start, end } = filters.dateRange;
              if (start && resultDate < new Date(start)) return false;
              if (end && resultDate > new Date(end)) return false;
            }
            return true;
          });
        },

        // Reset
        reset: () =>
          set({
            investigations: [],
            currentInvestigation: null,
            targets: [],
            results: [],
            loading: false,
            error: null,
            filters: {
              platform: null,
              status: null,
              dateRange: null,
            },
          }),
      })),
      {
        name: 'aura-osint-storage',
        partialize: (state) => ({
          investigations: state.investigations,
          currentInvestigation: state.currentInvestigation,
          filters: state.filters,
        }),
      }
    ),
    { name: 'OSINT Store' }
  )
);
20.2 Utilisation du Store dans les Composants
// src/views/OSINT/InvestigationsList.jsx
import React, { useEffect } from 'react';
import { useOSINTStore } from '../../store/osintStore';
import DataTable from '../../components/common/DataTable';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InvestigationsList = () => {
  const navigate = useNavigate();
  
  // Sélecteurs optimisés
  const investigations = useOSINTStore((state) => state.investigations);
  const loading = useOSINTStore((state) => state.loading);
  const error = useOSINTStore((state) => state.error);
  
  // Actions
  const fetchInvestigations = useOSINTStore((state) => state.fetchInvestigations);
  const deleteInvestigation = useOSINTStore((state) => state.deleteInvestigation);
  const setCurrentInvestigation = useOSINTStore((state) => state.setCurrentInvestigation);

  useEffect(() => {
    fetchInvestigations();
  }, [fetchInvestigations]);

  const handleView = (investigation) => {
    setCurrentInvestigation(investigation);
    navigate(`/osint/investigations/${investigation.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette enquête ?')) {
      await deleteInvestigation(id);
    }
  };

  const columns = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'platform', label: 'Plateforme' },
    { key: 'createdAt', label: 'Créée le', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          <Button size="sm" variant="info" onClick={() => handleView(row)}>
            Voir
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="ml-2"
            onClick={() => handleDelete(row.id)}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p>Chargement des enquêtes...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="investigations-list">
      <div className="d-flex justify-content-between mb-3">
        <h2>Mes Enquêtes OSINT</h2>
        <Button variant="primary" onClick={() => navigate('/osint/investigations/new')}>
          Nouvelle Enquête
        </Button>
      </div>

      <DataTable
        data={investigations}
        columns={columns}
        pagination
        pageSize={15}
        sortable
        filterable
        exportable
      />
    </div>
  );
};

export default InvestigationsList;

🔐 21. SÉCURITÉ AVANCÉE
21.1 Content Security Policy (CSP)
// backend/middleware/security.js
const helmet = require('helmet');

module.exports = (app) => {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // À éviter en production, utiliser nonce
          "https://cdn.jsdelivr.net",
          "https://www.google-analytics.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
        ],
        connectSrc: [
          "'self'",
          "https://api.aura-osint.com",
          "wss://api.aura-osint.com",
          "https://www.google-analytics.com",
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  // Autres headers de sécurité
  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  }));

  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.xssFilter());
  app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
  app.use(helmet.permittedCrossDomainPolicies());
};
21.2 Rate Limiting Avancé
// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

// Rate limiter général
const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:general:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: 'Trop de requêtes, veuillez réessayer plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour authentification (plus strict)
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives de connexion par 15 minutes
  skipSuccessfulRequests: true, // Ne compte que les échecs
  message: 'Trop de tentatives de connexion, compte temporairement verrouillé',
});

// Rate limiter pour API (par clé API)
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requêtes par minute
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  message: 'Limite d\'API atteinte, veuillez ralentir vos requêtes',
});

// Rate limiter pour exports (très limité)
const exportLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:export:',
  }),
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 exports par heure
  message: 'Limite d\'exports atteinte, veuillez attendre avant de réessayer',
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
  exportLimiter,
};
21.3 JWT avec Refresh Tokens
// backend/utils/jwt.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Génère une paire access token + refresh token
 */
const generateTokenPair = (userId, email, role) => {
  const accessToken = jwt.sign(
    { userId, email, role, type: 'access' },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh', jti: crypto.randomBytes(16).toString('hex') },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

/**
 * Vérifie un access token
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Vérifie un refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Révoque un refresh token (à stocker en base)
 */
const revokeRefreshToken = async (jti) => {
  // Stocker le JTI révoqué dans Redis avec expiration
  const redis = require('./redis');
  await redis.setex(`revoked:${jti}`, 7 * 24 * 60 * 60, '1');
};

/**
 * Vérifie si un refresh token est révoqué
 */
const isTokenRevoked = async (jti) => {
  const redis = require('./redis');
  const revoked = await redis.get(`revoked:${jti}`);
  return revoked !== null;
};

module.exports = {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  isTokenRevoked,
};
21.4 Middleware d'Authentification
// backend/middleware/auth.js
const { verifyAccessToken } = require('../utils/jwt');

/**
 * Middleware d'authentification
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Attacher les infos utilisateur à la requête
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware d'autorisation par rôle
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };

📊 22. MONITORING & OBSERVABILITÉ
22.1 Application Performance Monitoring (APM)
// backend/monitoring/apm.js
const apm = require('elastic-apm-node').start({
  serviceName: 'aura-osint-api',
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
  environment: process.env.NODE_ENV,
  logLevel: 'info',
  captureBody: 'errors',
  errorOnAbortedRequests: true,
  captureErrorLogStackTraces: 'always',
  
  // Sampling
  transactionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Ignore certains endpoints
  ignoreUrls: ['/health', '/metrics', '/favicon.ico'],
});

module.exports = apm;
22.2 Métriques Prometheus
// backend/monitoring/metrics.js
const promClient = require('prom-client');

// Collecteur par défaut (CPU, mémoire, etc.)
promClient.collectDefaultMetrics({ timeout: 5000 });

// Métriques custom
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const osintAnalysisTotal = new promClient.Counter({
  name: 'osint_analysis_total',
  help: 'Total number of OSINT analyses',
  labelNames: ['platform', 'status'],
});

const osintAnalysisDuration = new promClient.Histogram({
  name: 'osint_analysis_duration_seconds',
  help: 'Duration of OSINT analyses in seconds',
  labelNames: ['platform'],
  buckets: [1, 5, 10, 30, 60, 120, 300],
});

const activeInvestigations = new promClient.Gauge({
  name: 'active_investigations_total',
  help: 'Number of currently active investigations',
});

const databaseConnectionPool = new promClient.Gauge({
  name: 'database_connection_pool_size',
  help: 'Current database connection pool size',
  labelNames: ['state'], // idle, active, waiting
});

// Middleware pour tracker les requêtes HTTP
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });

  next();
};

// Endpoint pour Prometheus scraping
const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
  httpRequestDuration,
  httpRequestTotal,
  osintAnalysisTotal,
  osintAnalysisDuration,
  activeInvestigations,
  databaseConnectionPool,
};
22.3 Logging Structuré avec Winston
// backend/utils/logger.js
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
  },
  index: 'aura-osint-logs',
};

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'aura-osint-api',
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console en développement
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // Fichiers
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 10,
    }),
  ],
});

// Elasticsearch en production
if (process.env.NODE_ENV === 'production') {
  logger.add(new ElasticsearchTransport(esTransportOpts));
}

// Helper pour logger avec contexte
logger.logWithContext = (level, message, context = {}) => {
  logger.log({
    level,
    message,
    ...context,
    timestamp: new Date().toISOString(),
  });
};

module.exports = logger;

🎨 23. DESIGN SYSTEM & COMPOSANTS AVANCÉS
23.1 Theme Provider
// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

const THEMES = {
  dark: {
    name: 'dark',
    colors: {
      primary: '#1e88e5',
      secondary: '#26c6da',
      success: '#66bb6a',
      danger: '#ef5350',
      warning: '#ffa726',
      info: '#42a5f5',
      background: '#1a1a1a',
      surface: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#3a3a3a',
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.3)',
      md: '0 4px 6px rgba(0,0,0,0.4)',
      lg: '0 10px 20px rgba(0,0,0,0.5)',
    },
  },
  light: {
    name: 'light',
    colors: {
      primary: '#1976d2',
      secondary: '#0097a7',
      success: '#388e3c',
      danger: '#d32f2f',
      warning: '#f57c00',
      info: '#1976d2',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575',
      border: '#e0e0e0',
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 6px rgba(0,0,0,0.16)',
      lg: '0 10px 20px rgba(0,0,0,0.19)',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme: THEMES[theme],
    themeName: theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
23.2 Composant Toast Notifications Avancé
// src/components/common/Toast/ToastContainer.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '../../../store/toastStore';
import Toast from './Toast';
import './Toast.scss';

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
// src/store/toastStore.js
import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = uuidv4();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove après duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

// Helper functions
export const toast = {
  success: (message, options = {}) =>
    useToastStore.getState().addToast({ type: 'success', message, ...options }),
  
  error: (message, options = {}) =>
    useToastStore.getState().addToast({ type: 'error', message, ...options }),
  
  warning: (message, options = {}) =>
    useToastStore.getState().addToast({ type: 'warning', message, ...options }),
  
  info: (message, options = {}) =>
    useToastStore.getState().addToast({ type: 'info', message, ...options }),
};

🔄 24. WEBHOOKS & INTEGRATIONS
24.1 Système de Webhooks
// backend/services/webhookService.js
const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');
const { webhookModel } = require('../models');

class WebhookService {
  /**
   * Enregistre un webhook
   */
  async register(userId, url, events, secret) {
    const webhook = await webhookModel.create({
      userId,
      url,
      events,
      secret: secret || this.generateSecret(),
      active: true,
    });

    logger.info('Webhook registered', { webhookId: webhook.id, url, events });
    return webhook;
  }

  /**
   * Génère un secret pour signing
   */
  generateSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Envoie un événement à tous les webhooks concernés
   */
  async trigger(event, data) {
    const webhooks = await webhookModel.findByEvent(event);

    const promises = webhooks.map((webhook) =>
      this.send(webhook, event, data)
    );

    await Promise.allSettled(promises);
  }

  /**
   * Envoie une requête webhook
   */
  async send(webhook, event, data) {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const signature = this.sign(webhook.secret, payload);

    try {
      const response = await axios.post(webhook.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        timeout: 10000, // 10s timeout
      });

      logger.info('Webhook delivered', {
        webhookId: webhook.id,
        event,
        status: response.status,
      });

      // Réinitialiser le compteur d'échecs
      await webhookModel.update(webhook.id, { failureCount: 0 });

      return { success: true, status: response.status };
    } catch (error) {
      logger.error('Webhook delivery failed', {
        webhookId: webhook.id,
        event,
        error: error.message,
      });

      // Incrémenter le compteur d'échecs
      const failureCount = webhook.failureCount + 1;
      await webhookModel.update(webhook.id, { failureCount });

      // Désactiver après 10 échecs
      if (failureCount >= 10) {
        await webhookModel.update(webhook.id, { active: false });
        logger.warn('Webhook disabled due to repeated failures', {
          webhookId: webhook.id,
        });
      }

      return { success: false, error: error.message };
    }
  }

  /**
   * Signe un payload avec HMAC-SHA256
   */
  sign(secret, payload) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }

  /**
   * Vérifie la signature d'un webhook entrant
   */
  verify(secret, signature, payload) {
    const expected = this.sign(secret, payload);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  }
}

module.exports = new WebhookService();
24.2 Intégrations Tierces
// backend/integrations/slackIntegration.js
const { WebClient } = require('@slack/web-api');
const logger = require('../utils/logger');

class SlackIntegration {
  constructor(token) {
    this.client = new WebClient(token);
  }

  /**
   * Envoie une notification d'alerte
   */
  async sendAlert(channel, investigation, alert) {
    try {
      await this.client.chat.postMessage({
        channel,
        text: `🚨 Nouvelle alerte OSINT`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚨 Alerte OSINT',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Enquête:*\n${investigation.name}`,
              },
              {
                type: 'mrkdwn',
                text: `*Sévérité:*\n${alert.severity}`,
              },
              {
                type: 'mrkdwn',
                text: `*Plateforme:*\n${alert.platform}`,
              },
              {
                type: 'mrkdwn',
                text: `*Date:*\n${new Date(alert.createdAt).toLocaleString()}`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Description:*\n${alert.description}`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Voir les détails',
                },
                url: `${process.env.APP_URL}/investigations/${investigation.id}/alerts/${alert.id}`,
                style: 'primary',
              },
            ],
          },
        ],
      });

      logger.info('Slack alert sent', { channel, alertId: alert.id });
    } catch (error) {
      logger.error('Failed to send Slack alert', { error: error.message });
      throw error;
    }
  }

  /**
   * Envoie un rapport quotidien
   */
  async sendDailyReport(channel, stats) {
    try {
      await this.client.chat.postMessage({
        channel,
        text: '📊 Rapport quotidien AURA OSINT',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📊 Rapport Quotidien',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Enquêtes actives:*\n${stats.activeInvestigations}`,
              },
              {
                type: 'mrkdwn',
                text: `*Nouvelles alertes:*\n${stats.newAlerts}`,
              },
              {
                type: 'mrkdwn',
                text: `*Analyses complétées:*\n${stats.completedAnalyses}`,
              },
              {
                type: 'mrkdwn',
                text: `*Données collectées:*\n${stats.dataCollected}`,
              },
            ],
          },
        ],
      });

      logger.info('Daily report sent to Slack', { channel });
    } catch (error) {
      logger.error('Failed to send daily report', { error: error.message });
    }
  }
}

module.exports = SlackIntegration;

🎯 25. DÉFINITION OF DONE - CHECKLIST FINALE
## ✅ DÉFINITION OF DONE - CHECKLIST COMPLÈTE

### 📝 Code
- [ ] Code suit les conventions de nommage
- [ ] ESLint: 0 erreurs, 0 warnings
- [ ] Prettier appliqué sur tous les fichiers
- [ ] PropTypes définis pour tous les composants React
- [ ] JSDoc pour toutes les fonctions publiques
- [ ] Pas de console.log oubliés
- [ ] Pas de code commenté (dead code)
- [ ] Variables sensibles dans .env
- [ ] Imports organisés (React → Libraries → Components → Utils)

### 🧪 Tests
- [ ] Tests unitaires: Coverage > 70%
- [ ] Tests d'intégration pour services API
- [ ] Tests E2E pour parcours critiques
- [ ] Tests de performance validés
- [ ] Tests d'accessibilité (aXe, Lighthouse)
- [ ] Tests cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Tests mobile (iOS, Android)
- [ ] Tests de régression passés

### 🔐 Sécurité
- [ ] Toutes les entrées validées/sanitizées
- [ ] XSS protection implémentée
- [ ] CSRF tokens en place
- [ ] CSP headers configurés
- [ ] Rate limiting actif
- [ ] JWT avec refresh tokens
- [ ] Secrets en variables d'environnement
- [ ] HTTPS forcé en production
- [ ] 2FA disponible pour admins
- [ ] Audit de sécurité effectué
- [ ] Dépendances à jour (npm audit)

### ⚡ Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB (gzipped)
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Code splitting implémenté
- [ ] Cache strategy définie
- [ ] CDN configuré
- [ ] Compression Gzip/Brotli activée
- [ ] Database queries optimisées (indexes)
- [ ] N+1 queries résolues
- [ ] Core Web Vitals respectés

### ♿ Accessibilité
- [ ] WCAG 2.1 Level AA respecté
- [ ] Tous les éléments interactifs accessibles au clavier
- [ ] Focus visible sur tous les éléments
- [ ] Labels ARIA appropriés
- [ ] Contraste de couleur >= 4.5:1
- [ ] Skip links présents
- [ ] Screen reader friendly
- [ ] Pas de contenu clignotant
- [ ] Textes alternatifs sur toutes les images
- [ ] Support prefers-reduced-motion

### 🌐 Internationalisation
- [ ] i18n configuré
- [ ] Toutes les chaînes externalisées
- [ ] Support RTL pour langues arabes
- [ ] Formats de date/nombres localisés
- [ ] Pas de texte hardcodé dans le code

### 📱 Responsive & Mobile
- [ ] Mobile-first design
- [ ] Breakpoints testés (320px, 768px, 1024px, 1440px)
- [ ] Touch targets >= 44x44px
- [ ] Gestures optimisées (swipe, pinch)
- [ ] Orientation portrait/paysage supportée

### 📊 Monitoring & Logs
- [ ] Sentry configuré
- [ ] Logs structurés (Winston/Elasticsearch)
- [ ] Métriques Prometheus
- [ ] APM configuré (Elastic APM)
- [ ] Health checks implémentés
- [ ] Alertes configurées (PagerDuty, Slack)
- [ ] Dashboard de monitoring (Grafana)

### 🚀 Déploiement
- [ ] Variables d'environnement configurées
- [ ] CI/CD pipeline fonctionnel
- [ ] Smoke tests après déploiement
- [ ] Rollback plan défini
- [ ] Backup automatique configuré
- [ ] Blue/Green ou Canary deployment
- [ ] SSL certificates valides

### 📝 Documentation
- [ ] README à jour
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Changelog maintenu
- [ ] Architecture diagrams à jour
- [ ] Runbooks pour incidents
- [ ] Onboarding guide pour nouveaux devs
- [ ] Vidéos de démo (si applicable)

### ✅ Code Review
- [ ] Approuvé par 2+ développeurs
- [ ] Pas de commentaires non résolus
- [ ] Design review effectué
- [ ] Product owner validé
- [ ] QA approval obtenue

### 🔄 Post-Deployment
- [ ] Monitoring pendant 24h post-release
- [ ] Aucune régression détectée
- [ ]
TU N'A PAS FINIE ..(stopped)
TU N'A PAS FINIE  REPREND QUE A PARTIR DE LA OU ON EN ETAIS 📘 AURA OSINT - GUIDE COMPLET DÉVELOPPEMENT (SUITE)

✅ 17. CHECKLIST AVANT PRODUCTION (SUITE)
🔄 Post-Deployment

 Monitoring pendant 24h post-release
 Aucune régression détectée
 Métriques de performance stables
 Logs analysés (pas d'erreurs critiques)
 Feedback utilisateurs collecté
 Hotfix plan préparé si nécessaire
 Communication stakeholders effectuée
 Release notes publiées
 Documentation mise à jour
 Équipe support formée sur nouvelles features


🎨 19. DESIGN SYSTEM & UI/UX
19.1 Tokens de Design
// src/styles/tokens.js
export const designTokens = {
  // Colors
  colors: {
    primary: {
      50: '#e6f0ff',
      100: '#b3d1ff',
      200: '#80b3ff',
      300: '#4d94ff',
      400: '#1a75ff',
      500: '#0056e0',  // Main brand color
      600: '#0047b8',
      700: '#003890',
      800: '#002968',
      900: '#001a40',
    },
    secondary: {
      50: '#f0e6ff',
      100: '#d1b3ff',
      200: '#b380ff',
      300: '#944dff',
      400: '#751aff',
      500: '#5600e0',
      600: '#4700b8',
      700: '#380090',
      800: '#290068',
      900: '#1a0040',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Neutrals
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    // Semantic colors
    background: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
      inverse: '#ffffff',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing (based on 4px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Transitions
  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },
};

export default designTokens;
19.2 Component Library Structure
src/components/
├── ui/                       # Composants atomiques réutilisables
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.scss
│   │   ├── Button.test.jsx
│   │   └── Button.stories.jsx
│   │
│   ├── Input/
│   │   ├── Input.jsx
│   │   ├── Input.module.scss
│   │   ├── Input.test.jsx
│   │   └── Input.stories.jsx
│   │
│   ├── Card/
│   ├── Badge/
│   ├── Avatar/
│   ├── Tooltip/
│   ├── Modal/
│   ├── Dropdown/
│   └── Tabs/
│
├── form/                     # Composants de formulaire
│   ├── FormInput/
│   ├── FormSelect/
│   ├── FormCheckbox/
│   ├── FormRadio/
│   ├── FormTextarea/
│   └── FormDatePicker/
│
├── layout/                   # Composants de mise en page
│   ├── Container/
│   ├── Grid/
│   ├── Flex/
│   ├── Stack/
│   └── Spacer/
│
├── feedback/                 # Composants de feedback
│   ├── Alert/
│   ├── Toast/
│   ├── Spinner/
│   ├── Progress/
│   ├── Skeleton/
│   └── EmptyState/
│
└── data-display/            # Composants d'affichage de données
    ├── Table/
    ├── List/
    ├── Timeline/
    ├── Chart/
    └── StatCard/
19.3 Storybook Configuration
// .storybook/preview.js
import '../src/styles/global.scss';
import { designTokens } from '../src/styles/tokens';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: designTokens.colors.background },
      { name: 'dark', value: designTokens.colors.gray[900] },
      { name: 'surface', value: designTokens.colors.surface },
    ],
  },
  layout: 'centered',
};

export const decorators = [
  (Story) => (
    <div style={{ padding: '3rem' }}>
      <Story />
    </div>
  ),
];
// src/components/ui/Button/Button.stories.jsx
import React from 'react';
import Button from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
  size: 'md',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
  size: 'md',
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Loading Button',
  variant: 'primary',
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Disabled Button',
  variant: 'primary',
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: (
    <>
      <svg className="icon" width="20" height="20" viewBox="0 0 20 20">
        <path d="M10 0L12.5 7.5H20L14.5 12L17 19.5L10 15L3 19.5L5.5 12L0 7.5H7.5L10 0Z" />
      </svg>
      Button with Icon
    </>
  ),
  variant: 'primary',
};
19.4 Theming System
// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupérer le thème depuis localStorage ou système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Détecter la préférence système
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Appliquer le thème au document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
// src/styles/themes.scss
:root[data-theme='light'] {
  --color-background: #{$white};
  --color-surface: #{$gray-50};
  --color-primary: #{$primary-500};
  --color-text-primary: #{$gray-900};
  --color-text-secondary: #{$gray-600};
  --color-border: #{$gray-200};
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:root[data-theme='dark'] {
  --color-background: #{$gray-900};
  --color-surface: #{$gray-800};
  --color-primary: #{$primary-400};
  --color-text-primary: #{$gray-50};
  --color-text-secondary: #{$gray-400};
  --color-border: #{$gray-700};
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
}

// Usage dans les composants
.card {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

🔌 20. INTÉGRATION WEBSOCKET & TEMPS RÉEL
20.1 WebSocket Client Service
// src/services/websocket/WebSocketClient.js
import { io } from 'socket.io-client';
import { logger } from '@/utils/logger';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  connect(namespace = '/', options = {}) {
    const defaultOptions = {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
      auth: {
        token: localStorage.getItem('auth_token'),
      },
    };

    this.socket = io(
      `${process.env.REACT_APP_WS_URL}${namespace}`,
      { ...defaultOptions, ...options }
    );

    this.setupEventHandlers();
    return this;
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.info('WebSocket connected');
      this.emit('status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      logger.warn(`WebSocket disconnected: ${reason}`);
      this.emit('status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      logger.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logger.error('Max reconnect attempts reached');
        this.emit('error', { 
          message: 'Unable to connect to server',
          attempts: this.reconnectAttempts 
        });
      }
    });

    this.socket.on('error', (error) => {
      logger.error('WebSocket error:', error);
      this.emit('error', error);
    });

    // Heartbeat pour maintenir la connexion
    this.socket.on('ping', () => {
      this.socket.emit('pong');
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
    
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (callback) {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (this.socket) {
        this.socket.off(event, callback);
      }
    } else {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      logger.debug(`WebSocket emit: ${event}`, data);
    } else {
      logger.warn(`Cannot emit ${event}: socket not connected`);
    }
  }

  // Emit avec acknowledgement
  emitWithAck(event, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout waiting for acknowledgement: ${event}`));
      }, timeout);

      this.socket.emit(event, data, (response) => {
        clearTimeout(timeoutId);
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      logger.info('WebSocket disconnected manually');
    }
  }

  // Méthodes spécifiques OSINT
  subscribeToLiveStream(platform, streamId) {
    return this.emitWithAck('osint:subscribe', { platform, streamId });
  }

  unsubscribeFromLiveStream(platform, streamId) {
    this.emit('osint:unsubscribe', { platform, streamId });
  }

  subscribeToUserActivity(platform, userId) {
    return this.emitWithAck('osint:subscribe_user', { platform, userId });
  }

  // Notifications temps réel
  subscribeToNotifications() {
    this.on('notification', (data) => {
      logger.info('Notification received:', data);
      // Afficher notification navigateur
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/logo192.png',
          badge: '/logo192.png',
        });
      }
    });
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();
export default wsClient;
20.2 Hook useWebSocket
// src/hooks/useWebSocket.js
import { useEffect, useState, useRef, useCallback } from 'react';
import wsClient from '@/services/websocket/WebSocketClient';

export const useWebSocket = (namespace = '/', autoConnect = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const listenersRef = useRef([]);

  useEffect(() => {
    if (autoConnect && !wsClient.socket) {
      wsClient.connect(namespace);
    }

    const unsubStatus = wsClient.on('status', ({ connected }) => {
      setIsConnected(connected);
    });

    const unsubError = wsClient.on('error', (err) => {
      setError(err);
    });

    return () => {
      unsubStatus();
      unsubError();
      // Cleanup listeners
      listenersRef.current.forEach((unsub) => unsub());
    };
  }, [namespace, autoConnect]);

  const on = useCallback((event, callback) => {
    const unsubscribe = wsClient.on(event, callback);
    listenersRef.current.push(unsubscribe);
    return unsubscribe;
  }, []);

  const emit = useCallback((event, data) => {
    wsClient.emit(event, data);
  }, []);

  const emitWithAck = useCallback((event, data, timeout) => {
    return wsClient.emitWithAck(event, data, timeout);
  }, []);

  return {
    isConnected,
    error,
    on,
    emit,
    emitWithAck,
    socket: wsClient.socket,
  };
};

// Hook spécialisé pour OSINT Live
export const useOSINTLive = (platform, targetId) => {
  const { isConnected, on, emit } = useWebSocket('/osint');
  const [liveData, setLiveData] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (isConnected && targetId) {
      emit('subscribe', { platform, targetId });
      setIsSubscribed(true);

      const unsubscribe = on('live_update', (data) => {
        if (data.platform === platform && data.targetId === targetId) {
          setLiveData((prev) => [data, ...prev].slice(0, 100)); // Keep last 100
        }
      });

      return () => {
        emit('unsubscribe', { platform, targetId });
        unsubscribe();
        setIsSubscribed(false);
      };
    }
  }, [isConnected, platform, targetId]);

  return {
    liveData,
    isSubscribed,
    isConnected,
  };
};
20.3 Composant LiveFeed
// src/components/OSINT/LiveFeed.jsx
import React, { useEffect, useRef } from 'react';
import { useOSINTLive } from '@/hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './LiveFeed.module.scss';

const LiveFeed = ({ platform, targetId }) => {
  const { liveData, isSubscribed, isConnected } = useOSINTLive(platform, targetId);
  const feedRef = useRef(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [liveData, autoScroll]);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    setAutoScroll(scrollTop < 50);
  };

  return (
    <div className={styles.liveFeed}>
      <div className={styles.header}>
        <div className={styles.status}>
          <span className={`${styles.indicator} ${isConnected ? styles.connected : ''}`} />
          <span>{isConnected ? 'Connecté' : 'Déconnecté'}</span>
          {isSubscribed && <span className={styles.badge}>LIVE</span>}
        </div>
        <button
          className={styles.toggleAutoScroll}
          onClick={() => setAutoScroll(!autoScroll)}
        >
          {autoScroll ? '📌 Auto-scroll ON' : '📌 Auto-scroll OFF'}
        </button>
      </div>

      <div 
        ref={feedRef} 
        className={styles.feed}
        onScroll={handleScroll}
      >
        {liveData.length === 0 ? (
          <div className={styles.empty}>
            <p>En attente d'activité en direct...</p>
          </div>
        ) : (
          liveData.map((item, index) => (
            <LiveFeedItem key={`${item.id}-${index}`} data={item} />
          ))
        )}
      </div>
    </div>
  );
};

const LiveFeedItem = ({ data }) => {
  return (
    <div className={styles.feedItem}>
      <div className={styles.itemHeader}>
        <span className={styles.type}>{data.type}</span>
        <span className={styles.timestamp}>
          {formatDistanceToNow(new Date(data.timestamp), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
      </div>
      <div className={styles.itemContent}>
        {data.type === 'post' && (
          <>
            <p>{data.content}</p>
            {data.media && (
              <img src={data.media.thumbnail} alt="Post media" loading="lazy" />
            )}
          </>
        )}
        {data.type === 'comment' && (
          <p className={styles.comment}>
            💬 {data.author}: {data.content}
          </p>
        )}
        {data.type === 'live_stream' && (
          <div className={styles.liveStream}>
            🔴 {data.title} - {data.viewers} viewers
          </div>
        )}
      </div>
      <div className={styles.itemFooter}>
        <span>👁️ {data.views || 0}</span>
        <span>❤️ {data.likes || 0}</span>
        <span>💬 {data.comments || 0}</span>
        <span>🔁 {data.shares || 0}</span>
      </div>
    </div>
  );
};

export default LiveFeed;

🗄️ 21. STATE MANAGEMENT AVANCÉ
21.1 Zustand Store Configuration
// src/store/index.js
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Auth Store
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        permissions: [],

        login: (user, token) => {
          set({ user, token, isAuthenticated: true, permissions: user.permissions });
          localStorage.setItem('auth_token', token);
        },

        logout: () => {
          set({ user: null, token: null, isAuthenticated: false, permissions: [] });
          localStorage.removeItem('auth_token');
        },

        updateUser: (updates) => {
          set((state) => ({
            user: { ...state.user, ...updates },
          }));
        },

        hasPermission: (permission) => {
          return get().permissions.includes(permission);
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// OSINT Store
export const useOSINTStore = create(
  devtools(
    immer((set, get) => ({
      // State
      platforms: {
        tiktok: { data: [], loading: false, error: null, lastUpdate: null },
        facebook: { data: [], loading: false, error: null, lastUpdate: null },
        instagram: { data: [], loading: false, error: null, lastUpdate: null },
        twitter: { data: [], loading: false, error: null, lastUpdate: null },
      },
      activeQueries: [],
      savedSearches: [],
      filters: {},

      // Actions
      setLoading: (platform, loading) => {
        set((state) => {
          state.platforms[platform].loading = loading;
        });
      },

      setData: (platform, data) => {
        set((state) => {
          state.platforms[platform].data = data;
          state.platforms[platform].loading = false;
          state.platforms[platform].error = null;
          state.platforms[platform].lastUpdate = new Date().toISOString();
        });
      },

      setError: (platform, error) => {
        set((state) => {
          state.platforms[platform].error = error;
          state.platforms[platform].loading = false;
        });
      },

      addQuery: (query) => {
        set((state) => {
          state.activeQueries.push({
            id: Date.now(),
            ...query,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        });
      },

      updateQuery: (queryId, updates) => {
        set((state) => {
          const query = state.activeQueries.find((q) => q.id === queryId);
          if (query) {
            Object.assign(query, updates);
          }
        });
      },

      removeQuery: (queryId) => {
        set((state) => {
          state.activeQueries = state.activeQueries.filter((q) => q.id !== queryId);
        });
      },

      saveSearch: (search) => {
        set((state) => {
          state.savedSearches.push({
            id: Date.now(),
            ...search,
            savedAt: new Date().toISOString(),
          });
        });
      },

      removeSavedSearch: (searchId) => {
        set((state) => {
          state.savedSearches = state.savedSearches.filter((s) => s.id !== searchId);
        });
      },

      setFilters: (platform, filters) => {
        set((state) => {
          state.filters[platform] = filters;
        });
      },

      clearPlatformData: (platform) => {
        set((state) => {
          state.platforms[platform] = {
            data: [],
            loading: false,
            error: null,
            lastUpdate: null,
          };
        });
      },

      // Selectors
      getPlatformData: (platform) => get().platforms[platform].data,
      isLoading: (platform) => get().platforms[platform].loading,
      getError: (platform) => get().platforms[platform].error,
      getActiveQueries: () => get().activeQueries,
      getSavedSearches: () => get().savedSearches,
    })),
    { name: 'OSINTStore' }
  )
);

// UI Store
export const useUIStore = create(
  devtools(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Modals
      modals: {},
      openModal: (modalId, props = {}) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: { isOpen: true, props } },
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: { isOpen: false, props: {} } },
        })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { id: Date.now(), ...notification, createdAt: Date.now() },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // Loading states
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Theme (si non géré par Context)
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'UIStore' }
  )
);

// Metrics Store
export const useMetricsStore = create(
  devtools(
    (set, get) => ({
      metrics: {
        osint: {
          totalQueries: 0,
          successfulQueries: 0,
          failedQueries: 0,
          averageResponseTime: 0,
        },
        forensic: {
          totalAnalyses: 0,
          filesProcessed: 0,
          evidencesFound: 0,
        },
        rag: {
          totalDocuments: 0,
          totalQueries: 0,
          averageRelevance: 0,
        },
      },

      updateMetric: (category, key, value) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            [category]: {
              ...state.metrics[category],
              [key]: value,
            },
          },
        }));
      },

      incrementMetric: (category, key) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            [category]: {
              ...state.metrics[category],
              [key]: (state.metrics[category][key] || 0) + 1,
            },
          },
        }));
      },

      resetMetrics: (category) => {
        if (category) {
          set((state) => ({
            metrics: {
              ...state.metrics,
              [category]: {},
            },
          }));
        } else {
          set({
            metrics: {
              osint: {},
              forensic: {},
              rag: {},
            },
          });
        }
      },
    }),
    { name: 'MetricsStore' }
  )
);
21.2 Store Middleware Custom
// src/store/middleware/logger.js
export const logger = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.group('🔄 State Update');
      console.log('Previous State:', get());
      set(...args);
      console.log('Next State:', get());
      console.groupEnd();
    },
    get,
    api
  );

// src/store/middleware/persist.js
import { persist } from 'zustand/middleware';

export const createPersist = (name, options = {}) => {
  return persist(
    (set, get) => options.config(set, get),
    {
      name,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      ...options,
    }
  );
};

// src/store/middleware/sync.js
// Synchroniser le store avec le backend
export const syncWithBackend = (config) => (set, get, api) => {
  const syncInterval = 30000; // 30 secondes

  // Sync périodique
  setInterval(async () => {
    try {
      const state = get();
      await fetch('/api/state/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
    } catch (error) {
      console.error('State sync failed:', error);
    }
  }, syncInterval);

  return config(set, get, api);
};

🧪 22. TESTS AVANCÉS
22.1 Tests d'Intégration avec MSW
// src/test/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // OSINT endpoints
  rest.get('/api/v1/osint/tiktok', (req, res, ctx) => {
    const username = req.url.searchParams.get('username');
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          profile: {
            username,
            followers: 10000,
            following: 500,
            posts: 250,
          },
          posts: [
            {
              id: '1',
              content: 'Test post',
              likes: 100,
              comments: 10,
              shares: 5,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      })
    );
  }),

  rest.post('/api/v1/osint/tiktok/analyze', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          sentiment: 'positive',
          topics: ['tech', 'gaming'],
          engagement: {
            rate: 0.15,
            score: 85,
          },
        },
      })
    );
  }),

  // Auth endpoints
  rest.post('/api/v1/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'test@aura.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              email,
              name: 'Test User',
              role: 'admin',
              permissions: ['osint:read', 'osint:write'],
            },
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Invalid credentials',
      })
    );
  }),

  // Error simulation
  rest.get('/api/v1/osint/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: 'Internal server error',
      })
    );
  }),
];

// src/test/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './test/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
22.2 Tests de Stores
// src/store/__tests__/authStore.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../index';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store avant chaque test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],
    });
    localStorage.clear();
  });

  it('should handle login correctly', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login(
        {
          id: '1',
          email: 'test@aura.com',
          permissions: ['osint:read'],
        },
        'mock-token'
      );
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.email).toBe('test@aura.com');
    expect(result.current.token).toBe('mock-token');
    expect(localStorage.getItem('auth_token')).toBe('mock-token');
  });

  it('should handle logout correctly', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({ id: '1', permissions: [] }, 'mock-token');
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should check permissions correctly', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login(
        { id: '1', permissions: ['osint:read', 'osint:write'] },
        'mock-token'
      );
    });

    expect(result.current.hasPermission('osint:read')).toBe(true);
    expect(result.current.hasPermission('osint:delete')).toBe(false);
  });
});
22.3 Tests E2E avec Cypress
// cypress/e2e/osint/tiktok-analysis.cy.js
describe('TikTok Analysis Workflow', () => {
  beforeEach(() => {
    // Login
    cy.login('admin@aura.com', 'password123');
    cy.visit('/osint/tiktok');
  });

  it('should analyze a TikTok profile', () => {
    // Enter username
    cy.get('[data-testid="username-input"]').type('@testuser');
    
    // Click analyze button
    cy.get('[data-testid="analyze-button"]').click();
    
    // Wait for results
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
    
    // Verify results displayed
    cy.get('[data-testid="profile-card"]').should('be.visible');
    cy.get('[data-testid="profile-followers"]').should('contain', '10,000');
    cy.get('[data-testid="posts-list"]').children().should('have.length.gt', 0);
  });

  it('should handle errors gracefully', () => {
    // Force error
    cy.intercept('POST', '/api/v1/osint/tiktok/analyze', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('analyzeError');

    cy.get('[data-testid="username-input"]').type('@erroruser');
    cy.get('[data-testid="analyze-button"]').click();

    // Verify error message
    cy.wait('@analyzeError');
    cy.get('[data-testid="error-alert"]').should('be.visible');
    cy.get('[data-testid="error-alert"]').should('contain', 'Une erreur est survenue');
  });

  it('should export results', () => {
    // Analyze profile first
    cy.get('[data-testid="username-input"]').type('@testuser');
    cy.get('[data-testid="analyze-button"]').click();
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');

    // Click export button
    cy.get('[data-testid="export-button"]').click();
    
    // Select format
    cy.get('[data-testid="export-format-json"]').click();
    
    // Verify download
    cy.readFile('cypress/downloads/tiktok-analysis-testuser.json').should('exist');
  });

  it('should save search', () => {
    cy.get('[data-testid="username-input"]').type('@testuser');
    cy.get('[data-testid="analyze-button"]').click();
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');

    // Save search
    cy.get('[data-testid="save-search-button"]').click();
    cy.get('[data-testid="search-name-input"]').type('Test Search');
    cy.get('[data-testid="save-confirm-button"]').click();

    // Verify saved
    cy.get('[data-testid="notification"]').should('contain', 'Recherche sauvegardée');

    // Navigate to saved searches
    cy.visit('/osint/saved-searches');
    cy.get('[data-testid="saved-search-item"]').should('contain', 'Test Search');
  });
});

// cypress/e2e/auth/authentication.cy.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/auth/login');
  });

  it('should login successfully', () => {
    cy.get('[data-testid="email-input"]').type('admin@aura.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('contain', 'Admin');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('wrong@email.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-alert"]').should('contain', 'Identifiants invalides');
    cy.url().should('include', '/auth/login');
  });

  it('should validate form inputs', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-error"]').should('contain', 'Email requis');
    cy.get('[data-testid="password-error"]').should('contain', 'Mot de passe requis');
  });

  it('should logout successfully', () => {
    cy.login('admin@aura.com', 'password123');
    cy.visit('/dashboard');

    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();

    cy.url().should('include', '/auth/login');
    cy.getAllLocalStorage().should('be.empty');
  });
});
22.4 Tests de Performance
// cypress/e2e/performance/metrics.cy.js
describe('Performance Metrics', () => {
  it('should meet Core Web Vitals thresholds', () => {
    cy.visit('/dashboard', {
      onBeforeLoad: (win) => {
        // Mesurer les métriques
        win.performance.mark('app-start');
      },
    });

    cy.window().then((win) => {
      // First Contentful Paint
      cy.get('[data-testid="dashboard-header"]').should('be.visible').then(() => {
        const fcp = win.performance.getEntriesByType('paint')
          .find((entry) => entry.name === 'first-contentful-paint');
        expect(fcp.startTime).to.be.lessThan(1800); // < 1.8s
      });

      // Largest Contentful Paint
      const observer = new win.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        expect(lastEntry.startTime).to.be.lessThan(2500); // < 2.5s
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    });
  });

  it('should have acceptable bundle size', () => {
    cy.request('/static/js/main.*.js').then((response) => {
      const sizeKB = response.body.length / 1024;
      expect(sizeKB).to.be.lessThan(500); // < 500KB
    });
  });

  it('should load resources efficiently', () => {
    cy.visit('/dashboard');

    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource');
      
      // Vérifier le nombre de requêtes
      expect(resources.length).to.be.lessThan(50);
      
      // Vérifier les ressources bloquantes
      const blockingResources = resources.filter(
        (r) => r.renderBlockingStatus === 'blocking'
      );
      expect(blockingResources.length).to.be.lessThan(5);
    });
  });
});

📊 23. ANALYTICS & TRACKING
23.1 Google Analytics Integration
// src/services/analytics/GoogleAnalytics.js
class GoogleAnalytics {
  constructor() {
    this.isInitialized = false;
    this.trackingId = process.env.REACT_APP_GA_TRACKING_ID;
  }

  init() {
    if (this.isInitialized || !this.trackingId) return;

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', this.trackingId, {
      send_page_view: false, // Désactiver le suivi automatique
      cookie_flags: 'SameSite=None;Secure',
    });

    this.isInitialized = true;
  }

  // Page views
  pageView(path, title) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      page_path: path,
      page_title: title,
    });
  }

  // Events
  event(action, category, label, value) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // OSINT specific events
  trackOSINTQuery(platform, queryType) {
    this.event('osint_query', 'OSINT', `${platform}_${queryType}`);
  }

  trackExport(format, itemCount) {
    this.event('export', 'Export', format, itemCount);
  }

  trackError(errorType, errorMessage) {
    this.event('error', 'Error', `${errorType}: ${errorMessage}`);
  }

  // User timing
  timing(category, variable, value, label) {
    if (!this.isInitialized) return;

    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label,
    });
  }

  // E-commerce (si applicable)
  purchase(transactionId, value, items) {
    if (!this.isInitialized) return;

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'EUR',
      items: items,
    });
  }
}

export const analytics = new GoogleAnalytics();
export default analytics;
23.2 Custom Analytics Hook
// src/hooks/useAnalytics.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '@/services/analytics/GoogleAnalytics';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView(location.pathname, document.title);
  }, [location]);
};

export const useEventTracking = () => {
  const trackEvent = (action, category, label, value) => {
    analytics.event(action, category, label, value);
  };

  const trackOSINT = (platform, action) => {
    analytics.trackOSINTQuery(platform, action);
  };

  const trackExport = (format, count) => {
    analytics.trackExport(format, count);
  };

  const trackError = (type, message) => {
    analytics.trackError(type, message);
  };

  return {
    trackEvent,
    trackOSINT,
    trackExport,
    trackError,
  };
};

// Hook pour mesurer le temps d'exécution
export const useTimingTracking = () => {
  const startTiming = (category, variable) => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      analytics.timing(category, variable, Math.round(duration));
    };
  };

  return { startTiming };
};
23.3 Usage dans les Composants
// src/views/OSINT/TikTokAnalyzer.jsx
import React, { useState } from 'react';
import { useEventTracking, useTimingTracking } from '@/hooks/useAnalytics';

const TikTokAnalyzer = () => {
  const { trackOSINT, trackExport, trackError } = useEventTracking();
  const { startTiming } = useTimingTracking();
  const [username, setUsername] = useState('');

  const handleAnalyze = async () => {
    const endTiming = startTiming('OSINT', 'tiktok_analysis');

    try {
      trackOSINT('tiktok', 'analyze_profile');
      
      const result = await osintService.analyzeProfile('tiktok', username);
      
      endTiming(); // Mesurer la durée
      
    } catch (error) {
      trackError('osint_error', error.message);
      endTiming();
    }
  };

  const handleExport = (format) => {
    trackExport(format, data.length);
    // ... export logic
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

🔐 24. SÉCURITÉ AVANCÉE
24.1 Content Security Policy
// public/index.html
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' https://api.aura-osint.com wss://api.aura-osint.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      ">
24.2 XSS Protection
// src/utils/sanitize.js
import DOMPurify from 'dompurify';

/**
 * Nettoie le HTML pour prévenir les attaques XSS
 */
export const sanitizeHTML = (dirty, options = {}) => {
  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });
};

/**
 * Échappe les caractères spéciaux pour affichage sécurisé
 */
export const escapeHTML = (str) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Nettoie les URLs pour prévenir javascript: et data: schemes
 */
export const sanitizeURL = (url) => {
  const protocolPattern = /^(?:(?:https?|ftp):)?\/\//i;
  
  if (!protocolPattern.test(url)) {
    return '';
  }

  try {
    const parsed = new URL(url);
    if (['http:', 'https:', 'ftp:'].includes(parsed.protocol)) {
      return url;
    }
  } catch (e) {
    return '';
  }

  return '';
};

// Composant sécurisé pour afficher du HTML
import React from 'react';
import PropTypes from 'prop-types';

export const SafeHTML = ({ html, ...props }) => {
  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
    />
  );
};

SafeHTML.propTypes = {
  html: PropTypes.string.isRequired,
};
24.3 CSRF Protection
// src/utils/csrf.js
class CSRFProtection {
  constructor() {
    this.token = null;
    this.tokenHeaderName = 'X-CSRF-Token';
  }

  async fetchToken() {
    try {
      const response = await fetch('/api/v1/csrf-token', {
        credentials: 'include',
      });
      const data = await response.json();
      this.token = data.token;
      return this.token;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      return null;
    }
  }

  getToken() {
    return this.token;
  }

  getHeaders() {
    if (!this.token) {
      console.warn('CSRF token not available');
      return {};
    }
    return {
      [this.tokenHeaderName]: this.token,
    };
  }

  async refreshToken() {
    return await this.fetchToken();
  }
}

export const csrf = new CSRFProtection();
export default csrf;

// Intégration dans axios
// src/services/api/client.js
import axios from 'axios';
import csrf from '@/utils/csrf';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  withCredentials: true,
});

// Ajouter le token CSRF à chaque requête
apiClient.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      if (!csrf.getToken()) {
        await csrf.fetchToken();
      }
      config.headers = {
        ...config.headers,
        ...csrf.getHeaders(),
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token si expiré
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.csrfError) {
      await csrf.refreshToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
24.4 Rate Limiting Client-Side
// src/utils/rateLimiter.js
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  canMakeRequest(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // Nettoyer les anciennes requêtes
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
REPREND LA OU T'ÉTAIS ARRÊTER // src/utils/rateLimiter.js (SUITE)
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  canMakeRequest(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // Nettoyer les anciennes requêtes
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      const timeUntilReset = this.windowMs - (now - oldestRequest);
      return {
        allowed: false,
        retryAfter: Math.ceil(timeUntilReset / 1000), // en secondes
        remaining: 0,
      };
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return {
      allowed: true,
      remaining: this.maxRequests - validRequests.length,
      resetAt: now + this.windowMs,
    };
  }

  reset(key) {
    this.requests.delete(key);
  }

  resetAll() {
    this.requests.clear();
  }
}

// Export instances pour différents types de requêtes
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 req/min
export const osintRateLimiter = new RateLimiter(20, 60000); // 20 req/min
export const exportRateLimiter = new RateLimiter(5, 60000); // 5 exports/min

export default RateLimiter;
// src/hooks/useRateLimiter.js
import { useState, useCallback } from 'react';
import { apiRateLimiter } from '@/utils/rateLimiter';
import { useAuthStore } from '@/store';

export const useRateLimiter = (limiter = apiRateLimiter) => {
  const { user } = useAuthStore();
  const [isBlocked, setIsBlocked] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);

  const checkLimit = useCallback(
    (action = 'default') => {
      const key = user?.id ? `${user.id}-${action}` : `anonymous-${action}`;
      const result = limiter.canMakeRequest(key);

      if (!result.allowed) {
        setIsBlocked(true);
        setRetryAfter(result.retryAfter);
        
        // Auto-reset après le délai
        setTimeout(() => {
          setIsBlocked(false);
          setRetryAfter(null);
        }, result.retryAfter * 1000);

        return false;
      }

      setIsBlocked(false);
      return true;
    },
    [user, limiter]
  );

  return {
    checkLimit,
    isBlocked,
    retryAfter,
  };
};
24.5 Secure Local Storage
// src/utils/secureStorage.js
import CryptoJS from 'crypto-js';

class SecureStorage {
  constructor() {
    this.secretKey = process.env.REACT_APP_STORAGE_KEY || 'default-secret-key';
  }

  /**
   * Encrypt et stocke une valeur
   */
  setItem(key, value) {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        this.secretKey
      ).toString();
      
      localStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error('Failed to encrypt and store data:', error);
      return false;
    }
  }

  /**
   * Récupère et décrypte une valeur
   */
  getItem(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey);
      const original = decrypted.toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(original);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  /**
   * Supprime un item
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Vide tout le storage
   */
  clear() {
    localStorage.clear();
  }

  /**
   * Stockage avec expiration
   */
  setItemWithExpiry(key, value, ttl = 3600000) { // 1h par défaut
    const item = {
      value: value,
      expiry: Date.now() + ttl,
    };
    this.setItem(key, item);
  }

  /**
   * Récupération avec vérification d'expiration
   */
  getItemWithExpiry(key) {
    const item = this.getItem(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.removeItem(key);
      return null;
    }

    return item.value;
  }
}

export const secureStorage = new SecureStorage();
export default secureStorage;
24.6 Input Validation Middleware
// src/utils/validation.js
import validator from 'validator';

export const validationRules = {
  email: (value) => {
    if (!value) return 'Email requis';
    if (!validator.isEmail(value)) return 'Email invalide';
    return null;
  },

  password: (value) => {
    if (!value) return 'Mot de passe requis';
    if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/[A-Z]/.test(value)) return 'Le mot de passe doit contenir une majuscule';
    if (!/[a-z]/.test(value)) return 'Le mot de passe doit contenir une minuscule';
    if (!/[0-9]/.test(value)) return 'Le mot de passe doit contenir un chiffre';
    if (!/[!@#$%^&*]/.test(value)) return 'Le mot de passe doit contenir un caractère spécial';
    return null;
  },

  username: (value) => {
    if (!value) return 'Nom d\'utilisateur requis';
    if (value.length < 3) return 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, _ et -';
    return null;
  },

  url: (value) => {
    if (!value) return 'URL requise';
    if (!validator.isURL(value, { require_protocol: true })) return 'URL invalide';
    return null;
  },

  phone: (value) => {
    if (!value) return 'Numéro de téléphone requis';
    if (!validator.isMobilePhone(value, 'any')) return 'Numéro de téléphone invalide';
    return null;
  },

  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Ce champ est requis';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) {
      return `Doit contenir au moins ${min} caractères`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Ne peut pas dépasser ${max} caractères`;
    }
    return null;
  },

  pattern: (regex, message) => (value) => {
    if (value && !regex.test(value)) {
      return message || 'Format invalide';
    }
    return null;
  },

  custom: (validatorFn, message) => (value) => {
    if (!validatorFn(value)) {
      return message || 'Valeur invalide';
    }
    return null;
  },
};

/**
 * Valide un objet selon des règles
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Arrêter à la première erreur
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
// src/hooks/useFormValidation.js
import { useState, useCallback } from 'react';
import { validateForm } from '@/utils/validation';

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Valider le champ si déjà touché
    if (touched[name]) {
      const fieldError = validationRules[name] 
        ? validateForm({ [name]: value }, { [name]: validationRules[name] }).errors[name]
        : null;
      
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || null,
      }));
    }
  }, [touched, validationRules]);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Valider le champ au blur
    if (validationRules[name]) {
      const fieldError = validateForm(
        { [name]: values[name] },
        { [name]: validationRules[name] }
      ).errors[name];
      
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || null,
      }));
    }
  }, [values, validationRules]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);

    // Marquer tous les champs comme touchés
    const allTouched = Object.keys(validationRules).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Valider le formulaire complet
    const validation = validateForm(values, validationRules);
    setErrors(validation.errors);

    if (!validation.isValid) {
      setIsSubmitting(false);
      return { success: false, errors: validation.errors };
    }

    try {
      const result = await onSubmit(values);
      setIsSubmitting(false);
      return { success: true, data: result };
    } catch (error) {
      setIsSubmitting(false);
      return { success: false, error };
    }
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
};

🌐 25. INTERNATIONALISATION (i18n)
25.1 Configuration i18next
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import des traductions
import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  fr: { translation: translationFR },
  en: { translation: translationEN },
  es: { translation: translationES },
};

i18n
  .use(Backend) // Load translations via HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
25.2 Fichiers de Traduction
// src/i18n/locales/fr/translation.json
{
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur est survenue",
    "success": "Opération réussie",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "edit": "Modifier",
    "search": "Rechercher",
    "filter": "Filtrer",
    "export": "Exporter",
    "import": "Importer",
    "back": "Retour",
    "next": "Suivant",
    "previous": "Précédent",
    "close": "Fermer"
  },

  "auth": {
    "login": "Connexion",
    "logout": "Déconnexion",
    "register": "Inscription",
    "email": "Email",
    "password": "Mot de passe",
    "rememberMe": "Se souvenir de moi",
    "forgotPassword": "Mot de passe oublié ?",
    "resetPassword": "Réinitialiser le mot de passe",
    "invalidCredentials": "Identifiants invalides",
    "loginSuccess": "Connexion réussie",
    "logoutSuccess": "Déconnexion réussie"
  },

  "dashboard": {
    "title": "Tableau de bord",
    "welcome": "Bienvenue, {{name}}",
    "overview": "Vue d'ensemble",
    "statistics": "Statistiques",
    "recentActivity": "Activité récente",
    "quickActions": "Actions rapides"
  },

  "osint": {
    "title": "OSINT",
    "platforms": {
      "tiktok": "TikTok",
      "facebook": "Facebook",
      "instagram": "Instagram",
      "twitter": "Twitter"
    },
    "analyze": "Analyser",
    "profile": "Profil",
    "posts": "Publications",
    "followers": "Abonnés",
    "following": "Abonnements",
    "engagement": "Engagement",
    "sentiment": "Sentiment",
    "topics": "Sujets",
    "timeline": "Timeline",
    "export": "Exporter",
    "liveMonitoring": "Surveillance en direct",
    "searchPlaceholder": "Rechercher un utilisateur...",
    "noResults": "Aucun résultat trouvé",
    "analysisInProgress": "Analyse en cours...",
    "analysisComplete": "Analyse terminée"
  },

  "forensic": {
    "title": "Forensic",
    "timeline": "Timeline",
    "artifacts": "Artefacts",
    "evidence": "Preuves",
    "report": "Rapport",
    "analysis": "Analyse",
    "export": "Exporter le rapport"
  },

  "validation": {
    "required": "Ce champ est requis",
    "email": "Email invalide",
    "minLength": "Doit contenir au moins {{count}} caractères",
    "maxLength": "Ne peut pas dépasser {{count}} caractères",
    "password": {
      "weak": "Mot de passe trop faible",
      "medium": "Mot de passe moyen",
      "strong": "Mot de passe fort",
      "requirements": "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
    }
  },

  "errors": {
    "generic": "Une erreur est survenue",
    "network": "Erreur de connexion",
    "timeout": "La requête a expiré",
    "unauthorized": "Non autorisé",
    "forbidden": "Accès interdit",
    "notFound": "Ressource introuvable",
    "serverError": "Erreur serveur",
    "rateLimitExceeded": "Trop de requêtes. Réessayez dans {{seconds}} secondes"
  },

  "notifications": {
    "newActivity": "Nouvelle activité détectée",
    "analysisComplete": "Analyse terminée",
    "exportReady": "Export prêt",
    "errorOccurred": "Une erreur est survenue"
  }
}
// src/i18n/locales/en/translation.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Operation successful",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "import": "Import",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "close": "Close"
  },

  "auth": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    "email": "Email",
    "password": "Password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "resetPassword": "Reset password",
    "invalidCredentials": "Invalid credentials",
    "loginSuccess": "Login successful",
    "logoutSuccess": "Logout successful"
  },

  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome, {{name}}",
    "overview": "Overview",
    "statistics": "Statistics",
    "recentActivity": "Recent activity",
    "quickActions": "Quick actions"
  },

  "osint": {
    "title": "OSINT",
    "platforms": {
      "tiktok": "TikTok",
      "facebook": "Facebook",
      "instagram": "Instagram",
      "twitter": "Twitter"
    },
    "analyze": "Analyze",
    "profile": "Profile",
    "posts": "Posts",
    "followers": "Followers",
    "following": "Following",
    "engagement": "Engagement",
    "sentiment": "Sentiment",
    "topics": "Topics",
    "timeline": "Timeline",
    "export": "Export",
    "liveMonitoring": "Live monitoring",
    "searchPlaceholder": "Search for a user...",
    "noResults": "No results found",
    "analysisInProgress": "Analysis in progress...",
    "analysisComplete": "Analysis complete"
  }
}
25.3 Composants i18n
// src/components/common/LanguageSwitcher/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@/components/ui';
import styles from './LanguageSwitcher.module.scss';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <Dropdown
      trigger={
        <button className={styles.trigger}>
          <span className={styles.flag}>{currentLanguage.flag}</span>
          <span className={styles.name}>{currentLanguage.name}</span>
        </button>
      }
    >
      <div className={styles.menu}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`${styles.item} ${lang.code === i18n.language ? styles.active : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className={styles.flag}>{lang.flag}</span>
            <span className={styles.name}>{lang.name}</span>
            {lang.code === i18n.language && <span className={styles.check}>✓</span>}
          </button>
        ))}
      </div>
    </Dropdown>
  );
};

export default LanguageSwitcher;
25.4 Hook useTranslation personnalisé
// src/hooks/useI18n.js
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useTranslation = (namespace = 'translation') => {
  const { t, i18n } = useI18nTranslation(namespace);

  const translate = useCallback(
    (key, options = {}) => {
      return t(key, options);
    },
    [t]
  );

  const changeLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
      
      // Recharger certaines données si nécessaire
      // dispatch(fetchData());
    },
    [i18n]
  );

  const formatDate = useCallback(
    (date, format = 'long') => {
      const locale = i18n.language;
      const options = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        time: { hour: '2-digit', minute: '2-digit' },
        full: { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        },
      };

      return new Intl.DateTimeFormat(locale, options[format] || options.long).format(
        new Date(date)
      );
    },
    [i18n.language]
  );

  const formatNumber = useCallback(
    (number, options = {}) => {
      const locale = i18n.language;
      return new Intl.NumberFormat(locale, options).format(number);
    },
    [i18n.language]
  );

  const formatCurrency = useCallback(
    (amount, currency = 'EUR') => {
      const locale = i18n.language;
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    },
    [i18n.language]
  );

  return {
    t: translate,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
    formatDate,
    formatNumber,
    formatCurrency,
  };
};
25.5 Support RTL (Right-to-Left)
// src/utils/rtl.js
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const isRTL = (language) => {
  return RTL_LANGUAGES.includes(language);
};

export const getDirection = (language) => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

// Hook pour gérer RTL
// src/hooks/useRTL.js
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection } from '@/utils/rtl';

export const useRTL = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const direction = getDirection(i18n.language);
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return {
    isRTL: getDirection(i18n.language) === 'rtl',
    direction: getDirection(i18n.language),
  };
};
// src/styles/rtl.scss
[dir='rtl'] {
  text-align: right;

  .container {
    direction: rtl;
  }

  // Inverser les marges
  .ml-4 {
    margin-left: 0 !important;
    margin-right: 1rem !important;
  }

  .mr-4 {
    margin-right: 0 !important;
    margin-left: 1rem !important;
  }

  // Inverser les paddings
  .pl-4 {
    padding-left: 0 !important;
    padding-right: 1rem !important;
  }

  .pr-4 {
    padding-right: 0 !important;
    padding-left: 1rem !important;
  }

  // Inverser les icônes de direction
  .icon-arrow-right {
    transform: rotate(180deg);
  }

  // Inverser les bordures
  .border-left {
    border-left: none !important;
    border-right: 1px solid var(--color-border) !important;
  }

  .border-right {
    border-right: none !important;
    border-left: 1px solid var(--color-border) !important;
  }
}

📦 26. BUILD & OPTIMIZATION
26.1 Webpack Configuration Avancée
// config-overrides.js (si vous utilisez react-app-rewired)
const webpack = require('webpack');
const { override, addWebpackPlugin, addBabelPlugin } = require('customize-cra');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = override(
  // Ajouter compression Gzip/Brotli
  addWebpackPlugin(
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  ),
  
  addWebpackPlugin(
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 11,
      },
      threshold: 10240,
      minRatio: 0.8,
    })
  ),

  // Analyser le bundle (uniquement en dev)
  process.env.ANALYZE && addWebpackPlugin(new BundleAnalyzerPlugin()),

  // Tree shaking amélioré
  addBabelPlugin(['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]),

  // Configuration custom
  (config) => {
    // Code splitting optimisé
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor libs
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          // React libs
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'react-vendor',
            priority: 20,
          },
          // UI libs
          ui: {
            test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
            name: 'ui-vendor',
            priority: 15,
          },
          // Charts
          charts: {
            test: /[\\/]node_modules[\\/](recharts|chart\.js)[\\/]/,
            name: 'charts-vendor',
            priority: 15,
          },
          // Common code
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      runtimeChunk: 'single',
    };

    // Source maps optimisés pour production
    if (process.env.NODE_ENV === 'production') {
      config.devtool = 'source-map';
    }

    return config;
  }
);
26.2 Package.json Scripts Optimisés
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "build:analyze": "ANALYZE=true react-scripts build",
    "build:production": "NODE_ENV=production npm run build && npm run compress",
    "compress": "node scripts/compress-build.js",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:ci": "CI=true react-scripts test --coverage",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.{js,jsx} --max-warnings=0",
    "lint:fix": "eslint src/**/*.{js,jsx} --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,scss,md}\"",
    "type-check": "tsc --noEmit",
    "storybook": "start-storybook -p 6006 -s public",
    "build-storybook": "build-storybook -s public",
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "pre-commit": "lint-staged",
    "prepare": "husky install",
    "lighthouse": "node scripts/lighthouse.js",
    "bundle-size": "npm run build && bundlesize"
  },
  
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/**/*.{json,css,scss,md}": [
      "prettier --write"
    ]
  },

  "bundlesize": [
    {
      "path": "./build/static/js/*.js",
      "maxSize": "500 kB",
      "compression": "gzip"
    },
    {
      "path": "./build/static/css/*.css",
      "maxSize": "100 kB",
      "compression": "gzip"
    }
  ]
}
26.3 Script de Compression Post-Build
// scripts/compress-build.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
const glob = promisify(require('glob'));

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

const BUILD_DIR = path.join(__dirname, '../build');

const compressFile = async (filePath) => {
  const content = await fs.promises.readFile(filePath);
  
  // Gzip
  const gzipped = await gzip(content, { level: 9 });
  await fs.promises.writeFile(`${filePath}.gz`, gzipped);
  
  // Brotli
  const brotlied = await brotli(content, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    },
  });
  await fs.promises.writeFile(`${filePath}.br`, brotlied);
  
  const originalSize = content.length;
  const gzipSize = gzipped.length;
  const brotliSize = brotlied.length;
  
  console.log(`✓ ${path.basename(filePath)}`);
  console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`  Gzip: ${(gzipSize / 1024).toFixed(2)} KB (${((gzipSize / originalSize) * 100).toFixed(1)}%)`);
  console.log(`  Brotli: ${(brotliSize / 1024).toFixed(2)} KB (${((brotliSize / originalSize) * 100).toFixed(1)}%)`);
};

const compressAllAssets = async () => {
  console.log('🗜️  Compressing build assets...\n');
  
  // Compresser JS
  const jsFiles = await glob(`${BUILD_DIR}/static/js/*.js`);
  for (const file of jsFiles) {
    await compressFile(file);
  }
  
  // Compresser CSS
  const cssFiles = await glob(`${BUILD_DIR}/static/css/*.css`);
  for (const file of cssFiles) {
    await compressFile(file);
  }
  
  // Compresser HTML
  const htmlFiles = await glob(`${BUILD_DIR}/**/*.html`);
  for (const file of htmlFiles) {
    await compressFile(file);
  }
  
  console.log('\n✅ Compression terminée!');
};

compressAllAssets().catch((error) => {
  console.error('❌ Erreur lors de la compression:', error);
  process.exit(1);
});
26.4 Lighthouse CI
// scripts/lighthouse.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const runLighthouse = async (url) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

  // Générer le rapport
  const reportHtml = runnerResult.report;
  fs.writeFileSync('lighthouse-report.html', reportHtml);

  // Afficher les scores
  console.log('Lighthouse Scores:');
  console.log(`Performance: ${runnerResult.lhr.categories.performance.score * 100}`);
  console.log(`Accessibility: ${runnerResult.lhr.categories.accessibility.score * 100}`);
  console.log(`Best Practices: ${runnerResult.lhr.categories['best-practices'].score * 100}`);
  console.log(`SEO: ${runnerResult.lhr.categories.seo.score * 100}`);

  // Vérifier les seuils
  const performanceScore = runnerResult.lhr.categories.performance.score * 100;
  if (performanceScore < 90) {
    console.error(`❌ Performance score (${performanceScore}) est en dessous du seuil (90)`);
    process.exit(1);
  }

  await chrome.kill();
};

runLighthouse('http://localhost:3000').catch((error) => {
  console.error('Erreur Lighthouse:', error);
  process.exit(1);
});

🎯 27. CONCLUSION & RESSOURCES
27.1 Checklist Finale Production
## ✅ CHECKLIST COMPLÈTE AVANT MISE EN PRODUCTION

### Code & Architecture
- [ ] Code review complet effectué
- [ ] Toutes les dépendances à jour
- [ ] Aucun warning/error dans la console
- [ ] Code coverage > 70%
- [ ] Documentation à jour

### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size optimisé (< 500KB gzipped)
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Code splitting implémenté
- [ ] Service Worker configuré
- [ ] Cache strategy définie

### Sécurité
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] CSP headers configurés
- [ ] XSS/CSRF protection
- [ ] Input validation complète
- [ ] Rate limiting actif
- [ ] Secrets chiffrés

### SEO & Accessibilité
- [ ] Meta tags configurés
- [ ] Sitemap généré
- [ ] robots.txt configuré
- [ ] WCAG 2.1 AA respecté
- [ ] Semantic HTML
- [ ] Alt texts sur images

### Monitoring
- [ ] Sentry configuré
- [ ] Google Analytics
- [ ] Error tracking actif
- [ ] Performance monitoring
- [ ] Uptime monitoring

### Déploiement
- [ ] CI/CD fonctionnel
- [ ] Backups configurés
- [ ] Rollback plan défini
- [ ] Health checks actifs
- [ ] Documentation déploiement

### Post-Déploiement
- [ ] Smoke tests passés
- [ ] Monitoring actif 24h
- [ ] Équipe alertée
- [ ] Release notes publiées
27.2 Ressources Utiles
## 📚 RESSOURCES & DOCUMENTATION

### Documentation Officielle
- React: https://react.dev
- React Router: https://reactrouter.com
- Zustand: https://github.com/pmndrs/zustand
- TailwindCSS: https://tailwindcss.com
- Axios: https://axios-http.com

### Outils de Développement
- VS Code Extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - GitLens
  - Import Cost

### Testing
- Jest: https://jestjs.io
- React Testing Library: https://testing-library.com/react
- Cypress: https://www.cypress.io
- MSW: https://mswjs.io

### Performance
- Web.dev (Core Web Vitals): https://web.dev
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- WebPageTest: https://www.webpagetest.org
- Bundle Analyzer: https://www.npmjs.com/package/webpack-bundle-analyzer

### Sécurité
- OWASP Top 10: https://owasp.org/www-project-top-ten
- Snyk: https://snyk.io
- npm audit: https://docs.npmjs.com/cli/v8/commands/npm-audit

### Design
- Material-UI: https://mui.com
- Ant Design: https://ant.design
- Chakra UI: https://chakra-ui.com
- Storybook: https://storybook.js.org

### DevOps
- Docker: https://www.docker.com
- GitHub Actions: https://github.com/features/actions
- Vercel: https://vercel.com
- Netlify: https://www.netlify.com
27.3 Commandes Utiles
# 🚀 COMMANDES RAPIDES AURA OSINT

# Développement
npm start                    # Démarrer en mode dev
npm run lint                 # Linter le code
npm run lint:fix             # Fix automatique
npm run format               # Formater avec Prettier
npm run type-check           # Vérifier les types

# Testing
npm test                     # Lancer les tests
npm run test:coverage        # Tests avec coverage
npm run cy:open              # Ouvrir Cypress
npm run cy:run               # Exécuter tests E2E

# Build
npm run build                # Build production
npm run build:analyze        # Build + analyse bundle
npm run lighthouse           # Audit Lighthouse

# Storybook
npm run storybook            # Démarrer Storybook
npm run build-storybook      # Build Storybook

# Maintenance
npm outdated                 # Vérifier dépendances obsolètes
npm audit                    # Audit de sécurité
npm audit fix                # Fix vulnérabilités
npx npm-check-updates -u     # Mettre à jour toutes les deps

# Docker
docker-compose up -d         # Démarrer les containers
docker-compose logs -f       # Voir les logs
docker-compose down          # Arrêter les containers
docker system prune -a       # Nettoyer Docker

# Git
git log --oneline --graph    # Historique visuel
git checkout -b feature/xxx  # Créer une branche
git rebase main              # Rebaser sur main
git commit --amend           # Modifier dernier commit

🎉 FIN DU GUIDE
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    █████╗ ██╗   ██╗██████╗  █████╗                     │
│   ██╔══██╗██║   ██║██╔══██╗██╔══██╗                    │
│   ███████║██║   ██║██████╔╝███████║                    │
│   ██╔══██║██║   ██║██╔══██╗██╔══██║                    │
│   ██║  ██║╚██████╔╝██║  ██║██║  ██║                    │
│   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝                    │
│                                                         │
│            OSINT PLATFORM - DEV GUIDE                   │
│                  Version 1.0.0                          │
│                                                         │
│  Ce guide couvre:                                       │
│  ✅ Architecture & Structure                            │
│  ✅ Composants & Patterns                               │
│  ✅ State Management                                    │
│  ✅ API & Services                                      │
│  ✅ Testing (Unit/Integration/E2E)                      │
│  ✅ Sécurité & Validation                               │
│  ✅ Performance & Optimization                          │
│  ✅ i18n & Accessibilité                                │
│  ✅ Build & Déploiement                                 │
│  ✅ Monitoring & Analytics                              │
│                                                         │
│  📧 Contact: dev@aura-osint.com                         │
│  🌐 Docs: https://docs.aura-osint.com                   │
│  💬 Support: https://discord.gg/aura-osint              │
│                                                         │
│  Bon développement! 🚀                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
Ce guide est maintenant COMPLET et prêt à l'usage! 🎯