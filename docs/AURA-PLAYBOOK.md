# 📚 AURA OSINT PLAYBOOK - Guide Complet

## 📋 **SOMMAIRE**

1. [🎯 Architecture Générale](#architecture-générale)
2. [🏗️ Structure Technique](#structure-technique)
3. [🔒 Sécurité & Durcissement](#sécurité--durcissement)
4. [🔄 Flux Front ↔ Back ↔ CLI](#flux-front--back--cli)
5. [📊 Modules IA](#modules-ia)
6. [🚀 Roadmap & Checklists](#roadmap--checklists)
7. [⚙️ Guide Développement](#guide-développement)
8. [🔧 Configuration & Environnement](#configuration--environnement)

---

## 🎯 **ARCHITECTURE GÉNÉRALE**

### **Objectif Stratégique**
Architecture front unifiée, robuste et performante alignée sur l'écosystème IA AURA (PreIntel, Router, RAG, Guardrails, Observability) avec flux Front ↔ Back ↔ CLI orchestrés.

### **Modules Critiques**
- **🔍 Observability Dashboard** : KPIs temps réel (`tokens_saved_ratio`, `cache_hit_ratio`, `rag_p95`)
- **🧠 Router Decisions** : Décisions IA avec confidence et features
- **📚 RAG Explorer** : Query → chunks → context diff
- **🛡️ Guardrails & Policies** : Gestion des règles et versions
- **⚡ AI Efficiency** : Métriques tokens, pruning, cache hits
- **🕵️ Forensic Timeline** : Corrélations et anomalies temporelles
- **👥 Entity Intelligence** : Extraction entités et graphes

---

## 🏗️ **STRUCTURE TECHNIQUE**

### **Stack Recommandé**
- **Frontend** : React + Vite + TanStack Query + Zustand + Zod
- **Backend** : Node.js + Express + PostgreSQL + JWT
- **Communication** : OpenAPI + SSE + RBAC
- **Styling** : Tailwind CSS + Lucide Icons + Recharts

### **Architecture Dossiers**
```
src/
├── app/                 # Routing, app shell
├── core/
│   ├── api/            # OpenAPI client, interceptors
│   ├── auth/           # RBAC, role guards  
│   └── hooks/          # useRequestId, useSSE
├── modules/
│   ├── observability/  # Dashboard KPIs
│   ├── router/         # Decision viewer
│   ├── rag/           # Chunk explorer
│   └── guardrails/    # Policy management
├── shared/
│   ├── ui/            # Design System
│   ├── charts/        # Chart wrappers
│   └── layout/        # AppShell, Nav
└── state/             # Zustand stores
```

---

## 🔒 **SÉCURITÉ & DURCISSEMENT**

### **Vulnérabilités Corrigées**
- ✅ **SQL Injection** : Requêtes PostgreSQL paramétrées + validation Joi
- ✅ **CORS Wildcard** : Liste blanche stricte avec `CORS_ALLOWLIST`
- ✅ **JWT Algorithm** : Forcé à `HS256`, rejet des tokens `alg: none`
- ✅ **Credentials Exposés** : Suppression `.env` du repository

### **Mesures de Sécurité**
- **RBAC** : Rôles admin/analyst/viewer
- **X-Request-ID** : Propagation pour traçabilité
- **PII Masking** : Masquage côté UI et logs
- **Timeouts** : Statement timeout PostgreSQL (30s)
- **Rate Limiting** : Protection endpoints critiques

---

## 🔄 **FLUX FRONT ↔ BACK ↔ CLI**

### **Séquence Type : Obsolescence Scan**
```
User → Front: Click "Run Scan"
Front → Back: POST /ops/orchestrator/run {task:"obsolete-scan"}
Back → CLI: spawn script + pipe logs
Back → Front: SSE /ai/stream/metrics {progress}
CLI → Store: write reports/OBSOLETE-AUDIT.json
Front → Back: GET /ops/orchestrator/artifacts
Back → Front: Report URLs
Front → User: Live logs + download link
```

### **Endpoints Critiques**
| **Endpoint** | **Méthode** | **Usage** |
|--------------|-------------|-----------|
| `/ai/observability/summary` | GET | KPIs dashboard |
| `/ai/router/decisions` | GET | Décisions IA |
| `/ai/stream/metrics` | SSE | Métriques temps réel |
| `/ops/orchestrator/run` | POST | Lancer scripts |
| `/ops/orchestrator/artifacts` | GET | Télécharger rapports |

---

## 📊 **MODULES IA**

### **État d'Implémentation**

#### **🔍 Observability** ✅ **FONCTIONNEL**
- **Backend** : `/ai/observability/summary` + SSE metrics
- **Frontend** : Dashboard avec polling 5s + SSE streaming
- **Statut** : Opérationnel (mock), prêt pour production

#### **🧠 Router Decisions** 🟡 **PARTIEL**
- **Backend** : `/ai/router/decisions` avec format `{ items: [] }`
- **Frontend** : Viewer à implémenter
- **Statut** : Contrat normalisé, UI manquante

#### **📚 RAG Explorer** ❌ **MANQUANT**
- **Backend** : Stub `/ai/rag/chunks/:id` à créer
- **Frontend** : Module complet à développer
- **Statut** : Spécification définie, implémentation requise

#### **🛡️ Guardrails & Policies** ❌ **MANQUANT**
- **Backend** : Endpoint `/ai/policies/current` à créer
- **Frontend** : Interface gestion règles à développer
- **Statut** : Architecture définie, développement requis

---

## 🚀 **ROADMAP & CHECKLISTS**

### **Semaine 1 : Foundation**
- [x] App Shell + API client
- [x] Observability Dashboard v0
- [x] SSE streaming
- [x] Configuration centralisée
- [x] CORS sécurisé

### **Semaine 2 : Core Modules**
- [ ] Router Decisions viewer
- [ ] RAG Explorer v0
- [ ] Stubs API manquants

### **Semaine 3 : Advanced**
- [ ] Guardrails management
- [ ] Forensic Timeline
- [ ] Entity Intelligence

### **Semaine 4 : Polish**
- [ ] Admin panel
- [ ] Design System finalization
- [ ] Performance optimization

---

## ⚙️ **GUIDE DÉVELOPPEMENT**

### **Scripts Disponibles**
```bash
# Formatage et Linting
npm run format          # Prettier format
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run typecheck      # TypeScript check

# Développement
npm start              # Démarrer l'écosystème
npm run dev           # Mode développement
npm test              # Tests unitaires
npm run build         # Build production
```

### **Configuration Environnement**
```bash
# Variables Critiques
API_BASE_URL=http://localhost:4010
AI_GATEWAY_PORT=4010
CORS_ALLOWLIST=http://localhost:3000,http://localhost:3001
JWT_SECRET=your-secret-here
DATABASE_URL=postgresql://user:pass@localhost:5432/aura_osint
```

---

## 🔧 **CONFIGURATION & ENVIRONNEMENT**

### **Ports Standardisés**
- **Frontend** : 3000
- **Analytics API** : 4002  
- **AI Gateway** : 4010
- **Orchestrator** : 4001

### **Base de Données**
- **SGBD** : PostgreSQL
- **Schema** : `/database/schema.sql`
- **Connexions** : Pool avec timeout 30s
- **Sécurité** : Requêtes paramétrées obligatoires

### **Performance Targets**
- **FCP** : < 1.5s (intranet)
- **TTI** : < 2.5s
- **Bundle** : < 300KB (initial)
- **WCAG** : AA compliance

---

## 📈 **MÉTRIQUES & MONITORING**

### **KPIs Observability**
- `tokens_saved_ratio` : Ratio tokens économisés
- `cache_hit_ratio` : Taux de succès cache
- `rag_p95` : Latence P95 RAG (ms)
- `router_bypass_rate` : Taux bypass router

### **Monitoring UI**
- Event Bus UI pour tracking interactions
- Request latency tracking avec X-Request-ID
- Error centralization avec contexte

---

**🎯 OBJECTIF** : Interface "niveau monde" malgré la complexité infrastructure AURA