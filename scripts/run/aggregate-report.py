#!/usr/bin/env python3
"""
Agrège les métriques et JSON produits par full-run.sh et génère un rapport Markdown.
"""
import os, re, json, glob, statistics, datetime, hashlib, sys, textwrap

RUN_DIR = "logs/run"
FINAL_METRICS = f"{RUN_DIR}/final/metrics.prom"
DURING_DIR = f"{RUN_DIR}/during"
REPORTS_DIR = "reports"
TEMPLATE = "reports/templates/OBS-RUN-REPORT-TEMPLATE.md"
OUT_FILE = f"reports/AURA-IA-RUN-OBSERVATION-{datetime.date.today().isoformat()}.md"

os.makedirs(REPORTS_DIR, exist_ok=True)

def load_metrics(path):
    if not os.path.isfile(path):
        return {}
    with open(path,"r") as f: txt = f.read()
    metrics = {}
    for line in txt.splitlines():
        if line.startswith("#") or not line.strip():
            continue
        m = re.match(r'^([a-zA-Z0-9_:]+)(\{.*?\})?\s+([0-9\.eE\+\-]+)$', line)
        if m:
            name = m.group(1)
            val = float(m.group(3))
            metrics.setdefault(name, 0.0)
            metrics[name] += val
    return metrics

def read_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return {}

metrics = load_metrics(FINAL_METRICS)

def get_list(pattern):
    return sorted(glob.glob(pattern))

# Collect latences stress
stress_path = f"{DURING_DIR}/stress-latencies.txt"
stress_lat = []
if os.path.isfile(stress_path):
    with open(stress_path) as f:
        for line in f:
            try: stress_lat.append(float(line.strip()))
            except: pass

def percentile(data, p):
    if not data: return 0
    k = int(round((p/100.0) * (len(data)-1)))
    return sorted(data)[k]

tokens_in = metrics.get("ai_tokens_input_total",0)
tokens_out = metrics.get("ai_tokens_output_total",0)
tokens_saved = metrics.get("ai_tokens_saved_total",0)
cache_hits = metrics.get("ai_semantic_cache_hits_total",0)
pruning_events = metrics.get("ai_pruning_events_total",0)
rag_chunks = metrics.get("rag_retrieved_chunks_total",0)
rag_ingested = metrics.get("rag_ingested_chunks_total",0)
rag_cache_hits = metrics.get("rag_cache_hits_total",0)

ratio_saved = (tokens_saved / (tokens_in + tokens_out) * 100) if (tokens_in+tokens_out)>0 else 0
cache_hit_ratio = 0  # semantic + rag split (approx if we had misses)
# For rough: we can inspect metrics file for miss/hit lines separately
with open(FINAL_METRICS,"r") as f:
    sem_hits=0; sem_miss=0; rag_hit=0; rag_miss=0
    for line in f:
        if line.startswith("ai_semantic_cache_hits_total"):
            if 'result="hit"' in line: sem_hits += float(line.rsplit(' ',1)[-1])
            if 'result="miss"' in line: sem_miss += float(line.rsplit(' ',1)[-1])
        if line.startswith("rag_cache_hits_total"):
            if 'result="hit"' in line: rag_hit += float(line.rsplit(' ',1)[-1])
            if 'result="miss"' in line: rag_miss += float(line.rsplit(' ',1)[-1])
    cache_hit_ratio = (sem_hits / (sem_hits+sem_miss)*100) if (sem_hits+sem_miss)>0 else 0
    rag_cache_ratio = (rag_hit / (rag_hit+rag_miss)*100) if (rag_hit+rag_miss)>0 else 0

stress_summary = {
    "count": len(stress_lat),
    "avg_ms": round(statistics.mean(stress_lat),2) if stress_lat else 0,
    "p50_ms": percentile(stress_lat,50),
    "p95_ms": percentile(stress_lat,95)
}

def safe_hash_file(path):
    if not os.path.isfile(path): return "n/a"
    h = hashlib.sha256(open(path,'rb').read()).hexdigest()
    return "sha256:"+h[:16]

dataset_today = f"artifacts/dataset-capture-{datetime.datetime.now().isoformat().replace(':','_')}.jsonl"
# not exact; we copy earlier named; fallback to pattern:
ds_glob = sorted(glob.glob("artifacts/dataset-capture-*.jsonl"))
dataset_file = ds_glob[-1] if ds_glob else ""

dataset_hash = safe_hash_file(dataset_file)
dataset_lines = 0
if dataset_file and os.path.isfile(dataset_file):
    with open(dataset_file) as f:
        for _ in f: dataset_lines += 1

# Build markdown
if os.path.isfile(TEMPLATE):
    template = open(TEMPLATE).read()
else:
    template = "# AURA RUN REPORT\n\n(Template not found)\n"

report = template.format(
    DATE=datetime.date.today().isoformat(),
    TOKENS_IN=int(tokens_in),
    TOKENS_OUT=int(tokens_out),
    TOKENS_SAVED=int(tokens_saved),
    TOKENS_SAVE_RATIO=f"{ratio_saved:.2f}%",
    SEM_CACHE_HIT_RATIO=f"{cache_hit_ratio:.2f}%",
    RAG_CHUNKS=int(rag_chunks),
    RAG_INGESTED=int(rag_ingested),
    STRESS_COUNT=stress_summary["count"],
    STRESS_P50=stress_summary["p50_ms"],
    STRESS_P95=stress_summary["p95_ms"],
    STRESS_AVG=stress_summary["avg_ms"],
    DATASET_FILE=os.path.basename(dataset_file) if dataset_file else "n/a",
    DATASET_HASH=dataset_hash,
    DATASET_LINES=dataset_lines,
    PRUNING_EVENTS=int(pruning_events),
    RAG_CACHE_RATIO=f"{rag_cache_ratio:.2f}%"
)

with open(OUT_FILE,"w") as f:
    f.write(report)

# Export JSON KPIs
kpis = {
    "run_id": f"run_{datetime.datetime.now().isoformat()}",
    "ts": datetime.datetime.now().isoformat(),
    "model_hash": "sha256:placeholder",
    "tokens_in": int(tokens_in),
    "tokens_out": int(tokens_out),
    "tokens_saved": int(tokens_saved),
    "tokens_saved_ratio": round(ratio_saved, 2),
    "semantic_cache_hit_ratio": round(cache_hit_ratio, 2),
    "rag_retrieved_chunks_total": int(rag_chunks),
    "rag_ingested_chunks_total": int(rag_ingested),
    "stress_latency_ms": stress_summary,
    "pruning_events": int(pruning_events),
    "degrade_ratio": 0.0,
    "router_bypass_rate": 0.0,
    "guardrail_block_count": 0
}

kpi_file = f"artifacts/observability-kpis-{datetime.date.today().isoformat()}.json"
with open(kpi_file, "w") as f:
    json.dump(kpis, f, indent=2)

print(f"[REPORT] Généré: {OUT_FILE}")
print(f"[KPIs] Exporté: {kpi_file}")