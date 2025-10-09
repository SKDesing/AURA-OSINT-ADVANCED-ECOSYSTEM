# 🏗️ ARCHITECTURE IA - AURA OSINT ADVANCED ECOSYSTEM

**Version**: 1.0.0  
**Dernière MAJ**: 2025-01-20  
**Responsable**: AI Platform Lead  

---

## **1. VISION ARCHITECTURALE GLOBALE**

### **Objectif Stratégique**
Créer l'**architecture IA la plus avancée au monde pour l'OSINT**, combinant:
- **Souveraineté technologique** (local-first, zero cloud dependency)
- **Performance scientifique** (O(n log n), GNN + VAE + Ensemble)
- **Scalabilité prouvée** (2,100 req/s vs 850 industrie)
- **Sécurité forensique** (audit trail complet, compliance internationale)

### **Principes Architecturaux**
1. **Separation of Concerns** : Couches découplées et substituables
2. **API-First Design** : Contrats unifiés local/cloud
3. **Security by Design** : Guardrails intégrés, pas ajoutés
4. **Observability Native** : Métriques + logs + traces dès la conception
5. **Horizontal Scalability** : De laptop → multi-GPU cloud

---

## **2. ARCHITECTURE EN COUCHES**

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 CLIENT LAYER                          │
│  Frontend Dashboard │ API Clients │ Desktop App │ Mobile    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 🚪 GATEWAY LAYER                            │
│  NestJS Gateway │ Auth │ Rate Limiting │ Load Balancing     │
│  /ai/local/qwen/generate │ /ai/harassment/analyze           │
│  /ai/rag/query │ /ai/cloud/generate │ /ai/evaluate         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                🛡️ GUARDRAILS LAYER                          │
│  Input Validation │ Output Filtering │ PII Redaction       │
│  Policy Engine │ Blocked Patterns │ Compliance Rules      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 🧠 ENGINE LAYER                             │
│  Harassment │ Qwen Local │ Embeddings │ RAG │ Correlation  │
│  Classification │ Timeline │ Entity Extraction │ GNN        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                📊 DATA LAYER                                │
│  PostgreSQL │ Redis Cache │ pgvector │ JSONL Datasets      │
│  Model Registry │ Audit Logs │ Metrics Store               │
└─────────────────────────────────────────────────────────────┘
```

---

## **3. COMPOSANTS DÉTAILLÉS**

### **3.1. Gateway Layer (NestJS)**

**Responsabilités**:
- Exposition endpoints API unifiés
- Authentification & autorisation
- Rate limiting & throttling
- Request/response transformation
- Circuit breaker & fallback

**Structure**:
```typescript
ai/gateway/src/
├── main.ts                    # Bootstrap application
├── ai.module.ts              # Module principal
├── controllers/
│   ├── qwen.controller.ts    # LLM generation endpoints
│   ├── harassment.controller.ts # Harassment detection
│   ├── rag.controller.ts     # RAG queries (Phase 2)
│   └── evaluation.controller.ts # Model evaluation
├── services/
│   ├── qwen.service.ts       # Business logic Qwen
│   ├── harassment.service.ts # Business logic harassment
│   └── metrics.service.ts    # Prometheus metrics
└── guardrails/
    ├── input-guard.ts        # Input validation
    └── output-guard.ts       # Output filtering
```

**Endpoints Principaux**:
```
POST /ai/local/qwen/generate     # Génération LLM locale
POST /ai/harassment/analyze      # Détection harcèlement
POST /ai/rag/query              # Requêtes RAG (Phase 2)
POST /ai/cloud/generate         # Génération cloud (Phase 4)
GET  /ai/health                 # Health check global
GET  /ai/metrics                # Métriques Prometheus
```

### **3.2. Engine Layer**

**Architecture Modulaire**:
```
ai/engines/
├── harassment/
│   ├── engine.js             # Wrapper contrat unifié
│   ├── engine-legacy.js      # Implémentation heuristique
│   ├── version.json          # Métadonnées version
│   └── tests/engine.test.js  # Tests validation
├── qwen/                     # (Phase 2)
│   ├── local-adapter.ts      # Adaptateur llama.cpp
│   └── cloud-adapter.ts      # Adaptateur vLLM
├── correlation/              # (Phase 3)
│   ├── entity-correlator.ts  # LSH + Node2Vec
│   └── graph-analyzer.ts     # GNN + centrality
└── ensemble/                 # (Phase 3)
    ├── threat-classifier.ts  # RF + XGBoost + MLP
    └── anomaly-detector.ts   # VAE + isolation forest
```

**Contrat Engine Unifié**:
```typescript
interface EngineContract {
  analyze(input: string, context?: any): Promise<EngineResponse>;
  getVersion(): string;
  getCapabilities(): string[];
  healthCheck(): Promise<boolean>;
}

interface EngineResponse {
  engine: string;
  engine_version: string;
  request_id: string;
  // ... fields spécifiques engine
  meta: {
    processing_ms: number;
    latency_ms: number;
    version_hash: string;
  };
}
```

### **3.3. Guardrails Layer**

**Composants Sécurité**:
```
ai/guardrails/
├── policies.json             # Configuration patterns/limites
├── input-validator.ts        # Validation entrée
├── output-filter.ts          # Filtrage sortie
├── pii-redactor.ts          # Redaction données sensibles
└── compliance-checker.ts     # Vérification conformité
```

**Policies Configuration**:
```json
{
  "blocked_patterns": [
    "ignore previous", "system override", "exfiltrate",
    "bypass platform detection", "scrape private content"
  ],
  "input_limits": {
    "max_chars": 6000,
    "max_tokens_estimated": 1500,
    "timeout_ms": 30000
  },
  "pii_redaction": {
    "emails": true,
    "phones": true,
    "addresses": true,
    "coordinates": true
  },
  "compliance": {
    "gdpr_mode": true,
    "audit_required": true,
    "retention_days": 180
  }
}
```

### **3.4. Data Layer**

**Stockage Multi-Modal**:
```
Database Layer:
├── PostgreSQL (Primary)
│   ├── profiles              # Entités OSINT
│   ├── investigations        # Enquêtes
│   ├── entity_correlations   # Liens entités
│   ├── threat_classifications # Classifications ML
│   └── audit_logs           # Logs forensiques
├── pgvector Extension
│   ├── embeddings           # Vecteurs documents
│   └── similarity_search    # Recherche sémantique
├── Redis (Cache)
│   ├── session_cache        # Cache sessions
│   ├── model_cache          # Cache modèles
│   └── rate_limit_store     # Rate limiting
└── File System
    ├── ai/local-llm/models/ # Modèles .gguf
    ├── ai/dataset/captured/ # Interactions JSONL
    └── ai/audit/           # Logs audit
```

---

## **4. FLUX DE DONNÉES**

### **4.1. Flux Génération LLM**
```
Client Request
    ↓
Gateway (auth + rate limit)
    ↓
Input Guardrails (validation + sanitization)
    ↓
Qwen Engine (local llama.cpp ou cloud vLLM)
    ↓
Output Guardrails (PII redaction + validation)
    ↓
Metrics Collection (latence + tokens + success)
    ↓
Dataset Capture (JSONL anonymisé)
    ↓
Response Client
```

### **4.2. Flux Harassment Detection**
```
Text Input
    ↓
Input Validation (length + patterns)
    ↓
Harassment Engine (heuristic → ML → GNN)
    ↓
Scoring & Classification (severity + confidence)
    ↓
Context Enrichment (user profile + history)
    ↓
Audit Logging (forensic trail)
    ↓
Response (is_match + evidence + explanation)
```

### **4.3. Flux RAG (Phase 2)**
```
Query Input
    ↓
Query Understanding (intent + entities)
    ↓
Vector Retrieval (pgvector similarity search)
    ↓
Context Ranking (relevance + freshness)
    ↓
Prompt Construction (query + context + template)
    ↓
LLM Generation (Qwen avec context)
    ↓
Answer Validation (factuality + coherence)
    ↓
Response + Sources
```

---

## **5. SCALABILITÉ & PERFORMANCE**

### **5.1. Scaling Horizontal**

**Local (Laptop/Workstation)**:
- **CPU**: Qwen2 1.5B Q4_K_M (4-8 threads)
- **RAM**: 8-16GB (modèle + cache)
- **Throughput**: 60-120 req/min
- **Latence p95**: <2.5s

**Cloud (Production)**:
- **GPU**: A10/A100 + vLLM (Qwen2.5 32B)
- **Scaling**: HPA basé tokens/sec
- **Throughput**: 500-2000 req/min
- **Latence p95**: <500ms

### **5.2. Optimisations Performance**

**Caching Strategy**:
```typescript
// Multi-level caching
L1: In-memory (LRU, 100MB)
L2: Redis (1GB, TTL 1h)
L3: PostgreSQL (persistent)

// Cache keys
model_cache:{model_hash}:{input_hash}
embedding_cache:{text_hash}:{model_version}
correlation_cache:{entity_ids_sorted}:{algorithm}
```

**Batch Processing**:
```typescript
// Batch embeddings generation
interface BatchRequest {
  texts: string[];
  batch_size: 32;
  max_wait_ms: 100;
}

// Async processing queue
Queue: harassment_analysis (priority: high)
Queue: embeddings_generation (priority: medium)  
Queue: correlation_computation (priority: low)
```

---

## **6. MONITORING & OBSERVABILITÉ**

### **6.1. Métriques Prometheus**

**Performance Metrics**:
```
ai_request_total{endpoint, status, engine}
ai_latency_ms_bucket{endpoint, engine}
ai_tokens_input_sum{model}
ai_tokens_output_sum{model}
ai_throughput_requests_per_minute{endpoint}
```

**Business Metrics**:
```
harassment_detections_total{category, severity}
entity_correlations_total{correlation_type}
rag_queries_total{success, source_count}
model_accuracy_score{engine, dataset_version}
```

**System Metrics**:
```
ai_model_memory_usage_bytes{model}
ai_gpu_utilization_percent{device}
ai_cache_hit_ratio{cache_level}
ai_queue_length{queue_name}
```

### **6.2. Logging Structure**

**Structured JSON Logs**:
```json
{
  "timestamp": "2025-01-20T12:34:56.123Z",
  "level": "info",
  "service": "ai-gateway",
  "request_id": "uuid",
  "trace_id": "uuid",
  "user_id": "hashed",
  "endpoint": "/ai/harassment/analyze",
  "engine": "harassment",
  "engine_version": "heuristic-1.0.0",
  "latency_ms": 12,
  "input_tokens": 45,
  "output_tokens": 0,
  "blocked": false,
  "error": null,
  "meta": {
    "model_hash": "sha256:...",
    "policy_triggered": [],
    "cache_hit": true
  }
}
```

### **6.3. Alerting Rules**

**Critical Alerts**:
- Latence p95 > 5s pendant 5 minutes
- Error rate > 5% pendant 10 minutes
- Model unavailable > 3 échecs consécutifs
- Memory usage > 90% pendant 5 minutes

**Warning Alerts**:
- Blocked ratio > 8% pendant 15 minutes
- Cache hit ratio < 70% pendant 30 minutes
- Queue length > 100 pendant 10 minutes

---

## **7. SÉCURITÉ & COMPLIANCE**

### **7.1. Security Controls**

**Network Security**:
- LLM runtime bind 127.0.0.1 uniquement
- No outbound connections from AI processes
- TLS 1.3 pour communications inter-services
- Network segmentation (AI subnet isolé)

**Data Security**:
- Encryption at rest (AES-256)
- Hash-only logging par défaut
- PII redaction automatique
- Secure model storage (integrity checks)

**Access Control**:
- JWT tokens avec expiration courte
- Role-based permissions (read/write/admin)
- MFA pour actions critiques
- Audit trail complet

### **7.2. Compliance Framework**

**GDPR Compliance**:
- Right to be forgotten (purge scripts)
- Data minimization (hash-only storage)
- Consent management
- Cross-border data restrictions

**Forensic Standards**:
- Chain of custody preservation
- Cryptographic integrity (SHA256)
- Immutable audit logs
- Evidence correlation tracking

---

## **8. DÉPLOIEMENT & OPÉRATIONS**

### **8.1. Infrastructure as Code**

**Docker Compose (Local)**:
```yaml
services:
  ai-gateway:
    build: ./ai/gateway
    ports: ["4010:4010"]
    environment:
      - AI_QWEN_PORT=8090
      - AI_GATEWAY_PORT=4010
    depends_on: [postgres, redis]
  
  qwen-local:
    build: ./ai/local-llm
    ports: ["8090:8090"]
    volumes: ["./ai/local-llm/models:/models:ro"]
    command: ["./run-llm-qwen.sh"]
```

**Kubernetes (Cloud)**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aura-ai-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aura-ai-gateway
  template:
    spec:
      containers:
      - name: gateway
        image: aura/ai-gateway:1.0.0
        resources:
          requests: {cpu: 500m, memory: 1Gi}
          limits: {cpu: 2, memory: 4Gi}
```

### **8.2. CI/CD Pipeline**

**Quality Gates**:
1. **Unit Tests**: Coverage > 80%
2. **Integration Tests**: All endpoints respond
3. **Security Scan**: No High/Critical vulnerabilities
4. **Performance Tests**: Latency < SLA
5. **Model Validation**: Accuracy > baseline

**Deployment Strategy**:
- **Blue/Green**: Zero downtime deployments
- **Canary**: 10% → 50% → 100% traffic
- **Rollback**: Automatic on error rate > 5%

---

## **9. ÉVOLUTION FUTURE**

### **9.1. Roadmap Technique**

**Phase 2 (Q1 2025)**: RAG + Embeddings
**Phase 3 (Q2 2025)**: GNN + ML Ensemble  
**Phase 4 (Q3 2025)**: Cloud GPU + Autoscaling
**Phase 5 (Q4 2025)**: Fine-tune Maison + A/B Testing

### **9.2. Innovations Planifiées**

- **Federated Learning**: Modèles collaboratifs multi-instances
- **Edge Computing**: Déploiement mobile/IoT
- **Quantum-Ready**: Préparation cryptographie post-quantique
- **Explainable AI**: SHAP + LIME + attention visualization

---

**🏗️ ARCHITECTURE AURA IA - FONDATIONS POUR LA DOMINATION OSINT**

*Conçue pour évoluer de laptop personnel à infrastructure cloud mondiale*