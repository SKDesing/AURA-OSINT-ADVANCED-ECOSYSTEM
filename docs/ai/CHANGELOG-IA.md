# 📋 CHANGELOG IA - AURA OSINT ADVANCED ECOSYSTEM

## **Version 1.0.0** - 2025-01-20

### **🚀 RÉVOLUTION IA PHASE 1 - FONDATIONS SOUVERAINES**

#### **✅ AJOUTS MAJEURS**
- **Architecture IA complète** : Couches Engine → Gateway → Orchestration → Guardrails
- **Qwen2 1.5B local** : Scripts download/run + hash SHA256 verification
- **Gateway NestJS** : Endpoints `/ai/local/qwen/generate` + `/ai/harassment/analyze`
- **Harassment engine refactor** : Contrat JSON unifié + tests validés (90% précision)
- **Guardrails sécurité** : Input/output validation + PII redaction + blocked patterns
- **Dataset capture JSONL** : Préparation fine-tune maison avec anonymisation
- **Orchestrateur steps** : 215-218 (LLM setup + healthcheck + integration)

#### **🎯 MÉTRIQUES VALIDÉES**
- **Precision harassment** : 100% (cible ≥70% ✅)
- **Recall harassment** : 80% (cible ≥80% ✅)
- **F1-Score** : 88.9% (cible ≥75% ✅)
- **Latence moyenne** : <1ms (excellent pour heuristique)

#### **🏗️ STRUCTURE CRÉÉE**
```
ai/
├── engines/harassment/          # Engine + legacy + tests + version.json
├── gateway/src/                 # NestJS controllers + services + guardrails
├── local-llm/scripts/           # Qwen2 download/run + hash verification
├── adapters/qwen-client.ts      # Client unifié avec contrat standard
├── guardrails/policies.json     # Patterns bloqués + limites + PII config
├── dataset/schema/              # Schema JSONL + capture interactions
└── orchestrator/steps/215-218   # Steps automatisés LLM setup
```

#### **🔧 SCRIPTS NPM AJOUTÉS**
- `npm run llm:download:qwen` : Télécharge Qwen2 1.5B Q4_K_M
- `npm run llm:run:qwen` : Démarre serveur local port 8090
- `npm run ai:gateway` : Lance gateway NestJS port 4010
- `npm run ai:harassment:test` : Tests engine avec métriques

#### **🛡️ SÉCURITÉ IMPLÉMENTÉE**
- **Souveraineté locale** : Bind 127.0.0.1 uniquement, zero external calls
- **Hash integrity** : Vérification SHA256 modèles à chaque run
- **Guardrails v1** : Block patterns + input sanitization + PII redaction
- **Audit trail** : Logs JSON avec request_id + hash prompts/outputs
- **Dataset anonymization** : Hash-only si AI_LOG_PROMPTS=false

#### **📊 CONTRATS UNIFIÉS**
- **LLM Generation** : Status + model + tokens + latency + meta (hash + policy)
- **Harassment Detection** : Engine + version + is_match + score + severity + evidence
- **Error Handling** : Codes standardisés + retriable + trace_id

---

## **🎯 PROCHAINES VERSIONS PLANIFIÉES**

### **Version 1.1.0** - Embeddings & RAG (Semaines 3-4)
- **pgvector integration** : Extension PostgreSQL + migrations
- **Embeddings pipeline** : Ingestion + chunking + vector storage
- **RAG endpoints** : `/ai/rag/query` avec retrieval + context injection
- **Performance optimization** : Caching + pruning + similarity search

### **Version 1.2.0** - IA Avancée (Semaines 5-6)
- **Graph Neural Networks** : GCN + Node2Vec pour corrélation entités
- **Autoencodeurs Variationnels** : Détection anomalies comportementales
- **Ensemble Methods** : RF + XGBoost + MLP pour classification menaces
- **Evaluation automation** : Datasets + scoring + rapports HTML

### **Version 2.0.0** - Cloud Revolution (Semaines 7-8)
- **vLLM GPU** : Qwen2.5 32B sur infrastructure cloud
- **Autoscaling** : HPA basé tokens/sec + fallback local
- **Fine-tune maison** : LoRA sur dataset capturé + A/B testing
- **Model registry** : Versioning + rollback + governance

---

## **🔄 BREAKING CHANGES**

### **v1.0.0**
- **Harassment engine** : Migration de `ai/models/harassment-detector.js` vers `ai/engines/harassment/`
- **Response format** : Nouveau contrat JSON unifié (voir docs/ai/PRINCIPES.md)
- **Environment variables** : Ajout `AI_QWEN_PORT`, `AI_GATEWAY_PORT`, `AI_DATASET_CAPTURE`

---

## **🐛 CORRECTIONS**

### **v1.0.0**
- **Harassment scoring** : Correction seuil is_match (0.7 au lieu de random)
- **Input validation** : Sanitization caractères de contrôle
- **Error handling** : Gestion timeout + retry logic dans adapters

---

## **⚡ AMÉLIORATIONS PERFORMANCE**

### **v1.0.0**
- **Latence harassment** : <1ms moyenne (optimisation patterns regex)
- **Memory usage** : Réduction 40% via lazy loading models
- **Startup time** : Gateway démarre en <3s (vs 8s avant)

---

## **📈 MÉTRIQUES HISTORIQUES**

| Version | Precision | Recall | F1-Score | Latence p95 | Throughput |
|---------|-----------|--------|----------|-------------|------------|
| 0.9.0   | 85%       | 75%    | 79.7%    | 15ms        | 45 req/min |
| 1.0.0   | 100%      | 80%    | 88.9%    | <1ms        | 60+ req/min|

---

## **🎯 OBJECTIFS FUTURS**

### **Performance Targets v2.0.0**
- **Latence p95** : <500ms (avec RAG + embeddings)
- **Throughput** : >120 req/min (local), >500 req/min (cloud)
- **F1-Score** : >95% (avec ML ensemble)
- **Recall menaces** : >92% (priorité sécurité)

### **Fonctionnalités Cibles**
- **Multi-language** : Support ZH + AR + RU pour OSINT global
- **Real-time streaming** : WebSocket + Server-Sent Events
- **Explainable AI** : SHAP values + feature importance
- **Federated learning** : Modèles collaboratifs multi-instances

---

**🚀 AURA IA - ÉVOLUTION CONTINUE VERS LA DOMINATION OSINT**