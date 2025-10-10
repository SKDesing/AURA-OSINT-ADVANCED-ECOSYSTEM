# AI Health Endpoints

## Embeddings
- GET /ai/embeddings/health → 200
```json
{ "status":"ok","latency_ms":{"p50":25,"p95":40,"p99":50}, "cache":{"hit_ratio":0.6}, "error_rate":0.001, "model":"xenova/multilingual-e5-small" }
```

## Router/LLM
- GET /ai/router/health → 200
```json
{ "status":"ok","latency_ms":{"p50":800,"p95":1200,"p99":1500}, "accuracy":0.92, "bypass_detection":0.75, "error_rate":0.001, "model":"qwen2-1_5b-instruct-q4_k_m.gguf" }
```

## Aggregate
- GET /ai/health → 200
```json
{ "status":"ok","embeddings":"ok","router":"ok","system":{"os":"Linux 6.14.0","cpu":"AMD Ryzen 7","ram_gb":16,"node":"v20.0.0"},"ts":"2025-01-10T00:00:00Z" }
```

## Usage
- **Monitoring**: Prometheus/Grafana scraping
- **CI/CD**: Health checks before deployment
- **Load balancer**: Upstream health validation
- **Alerting**: SLO violation detection