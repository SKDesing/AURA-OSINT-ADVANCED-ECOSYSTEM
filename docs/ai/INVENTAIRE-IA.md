# 📋 INVENTAIRE IA - AURA OSINT ADVANCED ECOSYSTEM

## **ÉTAT ACTUEL (Phase 0)**

### **Moteurs Existants**
- ✅ **Harassment Detection** (heuristic, Node.js)
  - Localisation: `ai/models/harassment-detector.js` → migré vers `ai/engines/harassment/`
  - Version: heuristic-1.0.0
  - Langues: FR, EN
  - Catégories: threats, insults, doxxing, sexualHarassment, cyberbullying
  - Performance: Non validée (tests en cours)

- ⚠️ **Version Rust** (desktop)
  - Localisation: `desktop/src-tauri/`
  - Status: Divergente, à harmoniser avec contrat JSON
  - Action: Aligner sur engine contract unifié

### **Infrastructure Manquante**
- ❌ Gateway IA centralisée
- ❌ LLM local (Qwen2)
- ❌ Guardrails structurés
- ❌ Embeddings & RAG
- ❌ Dataset capture
- ❌ Métriques & observabilité

## **ARCHITECTURE CIBLE (Phase 1-4)**

### **Phase 1 - Fondations (Semaines 1-2)**
```
ai/
├── engines/harassment/          # Moteur harcèlement refactorisé
├── gateway/src/                 # Gateway NestJS
├── local-llm/                   # Qwen2 1.5B local
├── adapters/                    # Clients internes
├── guardrails/                  # Politiques sécurité
└── dataset/captured/            # Capture interactions
```

### **Phase 2 - Embeddings & RAG (Semaines 3-4)**
```
ai/
├── vector/                      # pgvector + ingestion
├── evaluation/                  # Tests & métriques
└── audit/                       # Logs sécurisés
```

### **Phase 3 - Avancé (Semaines 5-6)**
- Guardrails avancés (adversarial tests)
- Évaluation automatisée
- Optimisation performance

### **Phase 4 - Cloud (Semaines 7-8)**
- vLLM GPU (Qwen2.5 14B/32B)
- Autoscaling
- Fallback local

## **CONTRATS UNIFIÉS**

### **Engine Contract (Harassment)**
```json
{
  "engine": "harassment",
  "engine_version": "heuristic-1.0.0",
  "is_match": true,
  "score": 0.83,
  "severity": 7,
  "category": "threats",
  "evidence": ["kill", "je vais te"],
  "confidence": 0.9,
  "explanation": "...",
  "meta": { "processing_ms": 12 }
}
```

### **LLM Contract (Qwen)**
```json
{
  "status": "ok",
  "model": "qwen2-1_5b-instruct-q4_k_m",
  "engine_version": "1.0.0",
  "request_id": "uuid",
  "input_tokens": 512,
  "output_tokens": 210,
  "latency_ms": 1234,
  "data": { "text": "..." },
  "meta": {
    "prompt_hash": "sha256:...",
    "policy": { "blocked": false }
  }
}
```

## **MÉTRIQUES CIBLES**

### **Performance**
- Latence p95 < 2.5s (CPU local)
- Throughput > 60 req/min
- Disponibilité > 99%

### **Qualité Harassment**
- Recall ≥ 80% (éviter faux négatifs)
- Precision ≥ 70% (réduire bruit)
- F1-Score ≥ 75%

### **Sécurité**
- Blocked ratio < 5%
- Zero fuite PII
- Hash-only logging par défaut

## **ROADMAP IMMÉDIATE**

### **Sprint 0 (Cette semaine)**
- [x] Refactor harassment engine + contrat
- [x] Scripts Qwen2 download + run
- [x] Gateway NestJS + endpoints
- [x] Guardrails v1 + policies
- [x] Tests harassment (20 cas)
- [x] Orchestrateur steps 215-218

### **Sprint 1 (Semaine prochaine)**
- [ ] Installation Qwen2 + hash verify
- [ ] Gateway déployé + healthcheck
- [ ] Dataset capture opérationnel
- [ ] Tests harassment validés (seuils)
- [ ] Métriques basiques (latence)

## **DÉPENDANCES TECHNIQUES**

### **Nouvelles Dépendances**
```json
{
  "@nestjs/core": "^10.0.0",
  "@nestjs/common": "^10.0.0",
  "ts-node": "^10.9.0",
  "typescript": "^5.0.0",
  "uuid": "^9.0.0"
}
```

### **Scripts NPM Ajoutés**
- `npm run llm:download:qwen`
- `npm run llm:run:qwen`
- `npm run ai:gateway`
- `npm run ai:harassment:test`

## **SÉCURITÉ & COMPLIANCE**

### **Guardrails Implémentés**
- Block patterns: system override, ignore previous, exfiltrate
- Input sanitization: control chars, max 6000 chars
- PII redaction: emails, phones FR/EU
- Hash-only logging (AI_LOG_PROMPTS=false)

### **Audit Trail**
- Interactions JSONL (hash prompts/outputs)
- Model integrity (SHA256 verification)
- No external calls (offline-first)

## **PROCHAINES ÉTAPES**

1. **Exécuter tests**: `npm run ai:harassment:test`
2. **Installer Qwen**: `npm run llm:download:qwen`
3. **Démarrer gateway**: `npm run ai:gateway`
4. **Valider intégration**: Orchestrateur steps 215-218
5. **Mesurer performance**: Latence + throughput baseline