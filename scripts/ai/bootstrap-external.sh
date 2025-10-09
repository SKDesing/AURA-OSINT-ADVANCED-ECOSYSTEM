#!/usr/bin/env bash
set -euo pipefail

PHASE="${1:-1}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
EXT="$ROOT/external"
mkdir -p "$EXT"

clone_repo() {
  local url="$1" name="$2"
  if [ -d "$EXT/$name/.git" ]; then
    echo "↺ Update $name"
    (cd "$EXT/$name" && git pull --ff-only || true)
  else
    echo "⬇️ Clone $name"
    git clone --depth 1 "$url" "$EXT/$name"
  fi
  (cd "$EXT/$name" && git rev-parse HEAD > "$EXT/$name.COMMIT")
}

echo "🌐 Bootstrap External Repos – Phase $PHASE"

if [ "$PHASE" -ge 1 ]; then
  # llama.cpp already in ai/local-llm/runtime/
  if [ -d "ai/local-llm/runtime/llama.cpp/.git" ]; then
    (cd ai/local-llm/runtime/llama.cpp && git rev-parse HEAD > "$EXT/llama.cpp.COMMIT")
    echo "✅ llama.cpp commit pinned"
  fi
fi

if [ "$PHASE" -ge 2 ]; then
  echo "ℹ️ pgvector via Postgres extension (pas de clone)"
fi

if [ "$PHASE" -ge 4 ]; then
  clone_repo https://github.com/vllm-project/vllm vllm
fi

if [ "$PHASE" -ge 5 ]; then
  clone_repo https://github.com/huggingface/peft peft
fi

echo "✅ Done. Commits pins:"
ls -1 "$EXT"/*.COMMIT 2>/dev/null || echo "Aucun commit pin trouvé"