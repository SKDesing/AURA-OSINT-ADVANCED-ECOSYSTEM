# 🚀 AURA – PROMPT D'INSTALLATION & INTÉGRATION PROFESSIONNELLE QWEN (LOCAL → CLOUD)

Ce document est le SCRIPT D'EXÉCUTION OFFICIEL pour les équipes (Backend, IA, DevOps, Sécurité, Data) afin d'installer, vérifier et intégrer Qwen **en local souverain** (CPU) puis préparer l'extension **GPU / Cloud surpuissant** + future version fine‑tunée maison.

> NE PAS SAUTER D'ÉTAPE – TOUTE DÉVIATION = PR REFUSÉE  
> OBJECTIF PHASE IMMÉDIATE : Qwen2 1.5B Instruct quantifié (GGUF Q4_K_M) via llama.cpp + Gateway existante (placeholder)  
> PHASES SUIVANTES : Qwen 7B / 14B / 32B GPU (vLLM), Fine-tune LoRA maison, Cloud scaling

---

## 0. PRINCIPES (RAPPEL)

| Principe | Application Qwen |
|----------|------------------|
| Souveraineté | Téléchargement direct Hugging Face, hash SHA256, offline après bootstrap |
| Reproductibilité | Pin commit HF + stocker `MODEL_COMMIT` + `sha256` |
| Zéro fuite | `HF_HUB_OFFLINE=1` après download, exécution 127.0.0.1 uniquement |
| Sécurité | Vérif hash avant lancement, pas de logs prompts bruts si `AI_LOG_PROMPTS=false` |
| Portabilité | Même contrat API local ↔ cloud (/ai/local/qwen/generate & /ai/cloud/qwen/generate) |
| Mesure | Bench p50/p95/p99, tokens/sec, saturation mémoire |
| Observabilité | Metrics Prometheus (ajout phase: 1.1) |

---

## 1. MATRICE D'ENVIRONNEMENTS

| Environnement | Objectif | Runtime | Quantisation / Format | Cible RAM / VRAM | Status |
|---------------|----------|---------|-----------------------|------------------|--------|
| Laptop CPU (Phase 1) | Prototypage prompts & capture dataset | llama.cpp server | GGUF Q4_K_M | ~4–5 Go | Activer maintenant |
| Workstation GPU (Phase 2) | Tests latence + long context | PyTorch + vLLM | BF16 / FP16 | 16–24 Go VRAM | Préparer |
| Cloud GPU (Phase 4) | Haute capacité + multi-concurrence | vLLM (container) | FP16 + Paged KV | 40–80 Go VRAM | Plus tard |
| Fine-tune (Phase 5) | Adaptation maison | PEFT (LoRA) | bfloat16 + LoRA | 24+ Go VRAM | Plus tard |

---

## 2. VARIABLES D'ENVIRONNEMENT (AJOUTER .env)

```
AI_QWEN_MODEL_FILE=ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf
AI_QWEN_PORT=8090
AI_QWEN_CONTEXT=3072
AI_MAX_INPUT_CHARS=6000
AI_BLOCKED_PATTERNS=ignore previous;system override;exfiltrate;delete all data
AI_PII_REDACTION=true
AI_LOG_PROMPTS=false
AI_DATASET_CAPTURE=true
AI_DATASET_DIR=ai/dataset/captured
AI_GATEWAY_PORT=4010
HF_HUB_OFFLINE=1
```

---

## 3. INSTALLATION LOCAL (CPU) – PHASE IMMÉDIATE

### 3.1 Pré-requis système
```bash
node --version          # >=18 LTS
gcc --version           # AVX2 support recommandé
grep avx2 /proc/cpuinfo | head -1 || echo "⚠️ AVX2 absent (performances réduites)"
python3 --version       # >=3.9 (future phase)
cmake --version         # >=3.24 (pour build optionnel)
```

### 3.2 Téléchargement modèle (script déjà fourni)
```bash
bash ai/local-llm/scripts/download-qwen2-1_5b.sh
cat ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf.sha256
```

### 3.3 Vérification intégrité
```bash
sha256sum -c ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf.sha256
# Doit retourner OK
```

### 3.4 Build & Run llama.cpp (déjà scripté)
```bash
bash ai/local-llm/scripts/run-llm-qwen.sh &
sleep 4
curl -s -X POST http://127.0.0.1:$AI_QWEN_PORT/completion \
 -H "Content-Type: application/json" \
 -d '{"prompt":"你好，简述AURA系统。", "temperature":0.3, "n_predict":128}' | jq
```

### 3.5 Hardening minimal
- Vérifier port bind: `ss -ltnp | grep 8090 | grep 127.0.0.1`
- Aucune connection externe: `sudo lsof -i | grep llama || echo "✅ Offline"`

---

## 4. CHECKLIST "DONE" (PHASE 1 QWEN LOCAL)

| Code | Item | Attendu | Statut |
|------|------|---------|--------|
| QW-01 | Modèle téléchargé | .gguf + .sha256 | ⏳ |
| QW-02 | Hash vérifié | sha256 OK | ⏳ |
| QW-03 | Serveur llama.cpp | port 8090 up (127.0.0.1) | ⏳ |
| QW-04 | Prompt test zh | réponse non vide | ⏳ |
| QW-05 | Gateway placeholder | still operational | ⏳ |
| QW-06 | Intégration future planifiée | doc QWEN-INSTALL-PROMPT.md | ✅ |
| QW-07 | Pas de fuite net | lsof / netstat OK | ⏳ |
| QW-08 | Dataset capture | fichier du jour créé | ⏳ |
| QW-09 | Guardrails input | patterns bloqués testés | ⏳ |
| QW-10 | Bench initial | p95 < 2.5s | ⏳ |

---

## 5. COMMANDES RÉSUMÉES (COPIER-COLLER)

```bash
# 1. Download + verify
bash ai/local-llm/scripts/download-qwen2-1_5b.sh
sha256sum -c ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf.sha256

# 2. Run server
bash ai/local-llm/scripts/run-llm-qwen.sh &

# 3. Test prompt
curl -s -X POST http://127.0.0.1:$AI_QWEN_PORT/completion \
 -H "Content-Type: application/json" \
 -d '{"prompt":"你好，简述AURA系统。", "n_predict":128}' | jq '.content[0].text'

# 4. Vérifier dataset capture (après gateway intégration réelle)
ls ai/dataset/captured
```

---

## 6. PROCHAINES ACTIONS (APRÈS "GREEN")

| Étape | Action | Issue Tag |
|-------|--------|-----------|
| 1 | Remplacer placeholder QwenService | feat(ai) |
| 2 | Ajouter métriques prom-client (tokens, latence) | obs(ai) |
| 3 | Intégrer segmentation zh (nodejieba) si besoins classification | feat(ai-nlp) |
| 4 | Introduire test adversarial guardrails | sec(ai) |
| 5 | Préparer spec embeddings (bge-small-zh) | feat(rag) |

---

Fin – Ce document est l'UNIQUE source de vérité pour l'installation Qwen Phase 1.  
Exécuter, cocher, puis ouvrir PR "feat(ai): integrate qwen local phase1".