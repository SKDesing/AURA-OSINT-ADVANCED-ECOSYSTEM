# 🚪 AURA AI Observability Gating System

## Overview

The Observability Gating System provides automated quality assurance for AURA AI components through configurable thresholds and CI integration. It prevents regressions by blocking merges when performance degrades below acceptable levels.

## Gating Criteria

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| **Tokens Saved Ratio** | ≥45% | Ensures PREINTEL++ and Router efficiency |
| **Stress p95 Latency** | ≤2500ms | Maintains acceptable response times |
| **Cache Hit Ratio** | ≥30% | Validates semantic caching effectiveness |
| **RAG Chunks Retrieved** | ≥1 | Confirms RAG system functionality |
| **Degrade Ratio** | ≤5% | Limits fallback mode usage |
| **External Network** | 0 connections | Enforces security isolation |

## Usage

### Manual Gating
```bash
# Run observability test
bash scripts/run/full-run.sh

# Check quality gate
bash scripts/run/gate.sh
# Exit 0 = PASS, Exit 1 = FAIL
```

### CI Integration
The gating system automatically runs on:
- Pull requests affecting AI components
- Main branch pushes
- Manual workflow triggers

### Configuration
Override thresholds via environment variables:
```bash
export MIN_TOKENS_SAVED_RATIO=50
export MAX_STRESS_P95_MS=2000
export MIN_CACHE_HIT_RATIO=35
bash scripts/run/gate.sh
```

## Outputs

### JSON KPIs Export
```json
{
  "run_id": "run_2024-01-15T10:30:00",
  "ts": "2024-01-15T10:30:00.000Z",
  "tokens_saved_ratio": 52.34,
  "semantic_cache_hit_ratio": 41.22,
  "stress_latency_ms": {
    "count": 20,
    "p50": 880,
    "p95": 1460,
    "avg": 910
  }
}
```

### Regression Detection
```bash
python3 scripts/run/compare-runs.py
# Compares current run with previous baseline
# Flags regressions >5% in key metrics
```

### Report Signing
```bash
bash scripts/run/sign-report.sh
# Generates SHA256 signature for integrity verification
```

## CI Workflow

1. **Service Startup**: Postgres, LLM runtime, Gateway
2. **Observability Run**: Execute all test scenarios
3. **Metrics Collection**: Generate KPIs and reports
4. **Quality Gate**: Validate against thresholds
5. **Regression Check**: Compare with previous run
6. **Artifact Upload**: Store results for analysis
7. **PR Comment**: Post summary to pull request

## Troubleshooting

| Gate Failure | Likely Cause | Action |
|--------------|--------------|--------|
| Low token savings | Router/PREINTEL++ regression | Check algorithm routing logic |
| High latency | Model performance issue | Verify system resources |
| Low cache hits | Cache invalidation problem | Check semantic cache TTL |
| No RAG chunks | Embeddings worker failure | Restart embedding service |
| External connections | Security violation | Review network isolation |

## Quality Levels

- **PASS**: All thresholds met, ready for production
- **WARN**: Minor issues, investigate before merge
- **FAIL**: Critical regressions, block merge

The gating system ensures AURA AI maintains consistent performance and prevents quality degradation in production deployments.