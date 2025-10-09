# 🎨 AURA FRONT - ARCHITECTURE VISUELLE & COMMUNICATIONS

## 🎯 **OBJECTIF STRATÉGIQUE**
Architecture front unifiée, robuste et performante alignée sur l'écosystème IA AURA (PreIntel, Router, RAG, Guardrails, Observability) avec flux Front ↔ Back ↔ CLI orchestrés.

---

## 📊 **MODULES CRITIQUES IDENTIFIÉS**

### **🔍 Observability Dashboard**
- **KPIs**: `tokens_saved_ratio`, `cache_hit_ratio`, `rag_p95`, `router_bypass_rate`
- **Widgets**: StatTiles, TrendLines, Donut, Timeline (SSE)
- **Endpoint**: `GET /ai/observability/summary`

### **⚡ AI Efficiency**  
- **Métriques**: Tokens in/out/saved, pruning, cache hits
- **Endpoint**: `GET /ai/efficiency/metrics`

### **🧠 Router Decisions**
- **Data**: decision, confidence, features_hash
- **Endpoint**: `GET /ai/router/decisions?limit&since`

### **📚 RAG Explorer**
- **Flow**: Query → chunks → context diff → size gauge
- **Endpoint**: `GET /ai/rag/chunks/:id`

### **🛡️ Guardrails & Policies**
- **Data**: Policy version/hash, triggered rules
- **Endpoint**: `GET /ai/policies/current`

---

## 🏗️ **STRUCTURE TECHNIQUE**

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

## 🔄 **FLUX FRONT ↔ BACK ↔ CLI**

### **Séquence Type: Obsolescence Scan**
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

---

## 🛠️ **STACK TECHNIQUE RECOMMANDÉ**

### **Core**
- **React + Vite** (performance)
- **TanStack Query** (data layer)
- **Zustand** (state management)
- **Zod** (runtime validation)

### **UI/UX**
- **Tailwind CSS** (styling)
- **Lucide Icons** (iconographie)
- **Recharts** (visualisations)

### **Communication**
- **OpenAPI → TS Client** (contrats typés)
- **SSE** (streaming temps réel)
- **JWT + RBAC** (sécurité)

---

## 📡 **ENDPOINTS CRITIQUES**

| **Endpoint** | **Méthode** | **Usage** |
|--------------|-------------|-----------|
| `/ai/observability/summary` | GET | KPIs dashboard |
| `/ai/router/decisions` | GET | Décisions IA |
| `/ai/stream/metrics` | SSE | Métriques temps réel |
| `/ops/orchestrator/run` | POST | Lancer scripts |
| `/ops/orchestrator/artifacts` | GET | Télécharger rapports |

---

## 🚀 **ROADMAP 4 SEMAINES**

### **Semaine 1: Foundation**
- App Shell + API client
- Observability Dashboard v0
- SSE streaming

### **Semaine 2: Core Modules**
- Router Decisions viewer
- RAG Explorer v0

### **Semaine 3: Advanced**
- Guardrails management
- Forensic Timeline

### **Semaine 4: Polish**
- Entity Intelligence
- Admin panel
- Design System finalization

---

## 📊 **PERFORMANCE TARGETS**

- **FCP**: < 1.5s (intranet)
- **TTI**: < 2.5s
- **Bundle**: < 300KB (initial)
- **WCAG**: AA compliance

---

## 🔒 **SÉCURITÉ & OBSERVABILITÉ**

### **Sécurité**
- X-Request-ID propagation
- RBAC: admin/analyst/viewer
- PII masking côté UI

### **Monitoring**
- Event Bus UI
- Request latency tracking
- Error centralization

---

## ✅ **CHECKLIST IMPLÉMENTATION**

- [ ] App Shell + routing configuré
- [ ] API client OpenAPI généré
- [ ] SSE streaming opérationnel
- [ ] Observability Dashboard fonctionnel
- [ ] Router Decisions viewer
- [ ] RAG Explorer basique
- [ ] Guardrails management
- [ ] Tests unitaires > 80%
- [ ] Performance budget respecté
- [ ] Documentation équipe complète

**🎯 OBJECTIF**: Interface "niveau monde" malgré la complexité infrastructure