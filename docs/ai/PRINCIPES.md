# 🧠 PRINCIPES FONDAMENTAUX - AURA IA

## **DÉCISIONS STRATÉGIQUES FIGÉES**

1. **Souveraineté locale** : Exécution 100% offline par défaut
2. **Reproductibilité** : Modèles = .gguf + hash SHA256 + commit HF
3. **Séparation claire** : Engine → Gateway → Orchestration → Vector → Guardrails
4. **Sécurité "Shift Left"** : Guardrails avant RAG, logs anonymisés
5. **Auditabilité** : Interactions = JSONL (hash uniquement si AI_LOG_PROMPTS=false)
6. **Scalabilité Cloud** : Même API, provider différent
7. **Idempotence** : Steps orchestrateur non-destructifs
8. **Mesure d'abord** : Latence p50/p95, throughput, tokens

## **CONTRAT RÉPONSE UNIFIÉ**

### Génération LLM
```json
{
  "status": "ok|rejected|error",
  "model": "qwen2-1_5b-instruct-q4_k_m",
  "engine_version": "1.0.0",
  "request_id": "uuid",
  "input_tokens": 512,
  "output_tokens": 210,
  "latency_ms": 1234,
  "content_type": "structured|free",
  "data": { "text": "..." },
  "meta": {
    "prompt_hash": "sha256:...",
    "output_hash": "sha256:...",
    "policy": { "blocked": false, "reason": null }
  }
}
```

### Harassment Detection
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
  "meta": { "processing_ms": 12, "latency_ms": 12 }
}
```

## **MÉTRIQUES CIBLES**
- Latence p95 < 2.5s (CPU local)
- Recall harassment ≥ 0.8
- Precision harassment ≥ 0.7
- Blocked ratio < 5%