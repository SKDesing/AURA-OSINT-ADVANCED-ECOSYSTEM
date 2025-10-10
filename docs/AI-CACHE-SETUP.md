# AI Cache Setup — AURA

## Variables d'environnement
- HF_HOME=~/.cache/huggingface
- HF_HUB_CACHE=$HF_HOME/hub
- AURA_EMBED_CACHE_DIR=~/.cache/aura/embeddings

## Initialisation
```bash
export HF_HOME=~/.cache/huggingface
export HF_HUB_CACHE="$HF_HOME/hub"
export AURA_EMBED_CACHE_DIR=~/.cache/aura/embeddings
mkdir -p "$HF_HUB_CACHE" "$AURA_EMBED_CACHE_DIR"
```

## Warm-up recommandé
```bash
node scripts/audit/ai/warmup.js --embeddings 25 --llm 25 --dataset scripts/audit/ai/router-bench.dataset.json
```

## Vérification
- Plus d'alerte "cache directory not found"
- Hit ratio embeddings > 60% sur charge typique