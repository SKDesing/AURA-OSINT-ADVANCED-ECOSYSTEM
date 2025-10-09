# 🔍 AURA AI Observability Run - Complete System Testing

## Overview

The Observability Run is a comprehensive testing framework that validates all AURA AI components under controlled conditions. It executes 10 scenarios (A-J) covering LLM baseline, Router efficiency, PREINTEL++ optimization, RAG retrieval, Guardrails protection, and stress testing.

## Quick Start

```bash
# 1. Start services
bash ai/local-llm/scripts/run-llm-qwen.sh &
pnpm ai:gateway &

# 2. Run full observability test
bash scripts/run/full-run.sh

# 3. Extract metrics
bash scripts/run/quick-metrics.sh

# 4. Generate report
python3 scripts/run/aggregate-report.py
```

## Test Scenarios

| Scenario | Purpose | Expected Outcome |
|----------|---------|------------------|
| **A** | LLM Baseline | Latency < 2.5s, tokens measured |
| **B** | Router NER | Entity extraction bypass |
| **C** | Forensic Timeline | Pattern analysis routing |
| **D** | Harassment Detection | Classification + lexical scoring |
| **E** | Cache Hit Test | Second request cached |
| **F** | Pruning Long Text | Token reduction via repetition detection |
| **G** | RAG Ingestion/Query | Document retrieval + context |
| **H** | Guardrails Injection | Security pattern blocking |
| **I** | Degrade Simulation | Fallback behavior (optional) |
| **J** | Stress Test | 20 concurrent requests stability |

## Success Criteria

| Metric | Target | Pass | Warn | Fail |
|--------|--------|------|------|------|
| **Tokens Saved Ratio** | ≥55% | ≥50% | 35-49% | <35% |
| **LLM p95 Latency** | ≤2500ms | ≤2500ms | 2500-3200ms | >3200ms |
| **Cache Hit Ratio** | ≥40% | ≥40% | 25-39% | <25% |
| **Router Bypass Rate** | ≥60% | ≥60% | 40-59% | <40% |
| **Guardrails Block Rate** | ≥90% | ≥90% | 75-89% | <75% |

## Configuration

Environment variables in `.env`:
```bash
GATEWAY_URL=http://127.0.0.1:4010
LLM_URL=http://127.0.0.1:8090
STRESS_COUNT=20
DEGRADE_SIMULATION=false
```

## Output Structure

```
logs/run/
├── initial/          # System state before run
├── during/           # JSON responses per scenario
└── final/            # Metrics and system state after run

artifacts/
├── dataset-capture-*.jsonl    # Captured interactions
└── aura-run-*.tar.gz         # Complete archive

reports/
└── AURA-IA-RUN-OBSERVATION-*.md  # Generated report
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gateway unreachable | Start with `pnpm ai:gateway` |
| LLM timeout | Check `bash ai/local-llm/scripts/run-llm-qwen.sh` |
| Missing metrics | Verify Prometheus endpoint `/metrics` |
| Low cache hits | Check semantic cache TTL settings |
| High latency | Reduce `maxTokens` or check system load |

## Next Steps After Run

1. **PASS**: Proceed to Guardrails++ and EVAL harness
2. **WARN**: Investigate specific metrics and optimize
3. **FAIL**: Address critical issues before continuing

The observability run establishes the baseline for all future AI optimizations and provides the foundation for production deployment.