# 🎯 AURA Algorithm Router - Official Documentation

## Overview

The Algorithm Router is the core decision engine that determines whether a prompt should be processed by specialized local algorithms or routed to the LLM. This implements the "Deterministic First" principle of AURA's Zero Waste AI architecture.

## Decision Matrix

| Algorithm | Trigger Conditions | Token Savings | Confidence |
|-----------|-------------------|---------------|------------|
| **NER** | ≥2 entities detected (names, emails, SIRET, phones) | 85% | 0.9 |
| **Forensic** | Timeline keywords (chronologie, séquence, pattern) | 80% | 0.85 |
| **Harassment** | High lexical score (>0.5) + harassment patterns | 90% | 0.95 |
| **NLP** | Low lexical score (<0.3) + toxicity keywords | 60% | 0.75 |
| **RAG+LLM** | Context retrieval keywords (documents, sources) | 0% | 0.8 |
| **LLM** | No specialized match found | 0% | 0.6 |

## API Contract

### Decision Request
```typescript
POST /ai/router/decide
{
  "prompt": string,
  "lexical_score"?: number,
  "language"?: string
}
```

### Decision Response
```typescript
{
  "router_version": "1.0.0",
  "matched_algorithm": "ner|forensic|nlp|harassment|rag+llm|llm",
  "confidence": 0.0-1.0,
  "extraction_entities"?: string[],
  "reason": string,
  "preintel_signature": "sha256:...",
  "tokens_saved_estimate"?: number
}
```

## Metrics

- `ai_router_decision_total{decision}` - Decisions by algorithm type
- `ai_router_tokens_saved_total` - Total tokens saved through routing
- `ai_router_accuracy` - Decision accuracy percentage
- `ai_router_bypass_rate` - Percentage bypassing LLM

## Target KPIs

- **LLM Bypass Rate**: ≥65%
- **Token Savings**: ≥55%
- **Router Accuracy**: ≥90%
- **Misclassification**: <7%

## Usage Examples

```bash
# Entity extraction
curl -X POST /ai/router/decide \
  -d '{"prompt": "Contact: Jean Dupont, email: jean@test.com"}'
# → {"matched_algorithm": "ner", "confidence": 0.9}

# Forensic analysis  
curl -X POST /ai/router/decide \
  -d '{"prompt": "Analyser chronologie 08:30-10:45"}'
# → {"matched_algorithm": "forensic", "confidence": 0.85}

# Harassment detection
curl -X POST /ai/router/decide \
  -d '{"prompt": "Message haineux", "lexical_score": 0.7}'
# → {"matched_algorithm": "harassment", "confidence": 0.95}
```

## Integration

The router integrates with:
- **Preintel Layer**: Uses lexical scoring and language detection
- **Metrics Service**: Tracks performance and bypass rates
- **Algorithm Engines**: Routes to specialized processors
- **Guardrails**: Applies risk-based response limits

## Benchmarking

Run performance benchmarks:
```bash
./scripts/bench-router.sh
```

Expected results:
- 55%+ token savings vs baseline
- 65%+ LLM bypass rate
- <2.5s p95 latency