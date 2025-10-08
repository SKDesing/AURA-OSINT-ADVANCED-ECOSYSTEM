#!/bin/bash
set -euo pipefail  # ⚠️ Échec immédiat si erreur

# --- CONFIGURATION ---
CHROMIUM_SRC="core/src"
BUILD_DIR="core/out/Release"
SCRAPER_ENGINE="scraper/engines/aura_chromium"
PNPM_WORKSPACE="pnpm-workspace.yaml"

# --- BUILD CHROMIUM (C++) ---
echo "🔧 [1/3] Compilation Chromium (C++17, GN/Ninja)"
cd "$CHROMIUM_SRC"
gn gen "$BUILD_DIR" --args=" \
    is_debug=false \
    is_component_build=true \
    symbol_level=0 \
    strip_debug_info=true"
ninja -C "$BUILD_DIR" chrome -j$(nproc)

# --- LINK BINAIRES ---
echo "🔗 [2/3] Liaison binaires → Scraper"
ln -sf "$BUILD_DIR/chrome" "$SCRAPER_ENGINE"

# --- BUILD JS (PNPM) ---
echo "📦 [3/3] Modules JS (PNPM)"
cd ../..
if [ ! -f "$PNPM_WORKSPACE" ]; then
    echo "❌ ERREUR: $PNPM_WORKSPACE manquant" >&2
    exit 1
fi
pnpm install --frozen-lockfile --shamefully-hoist
pnpm --filter "./scraper" build

# --- VALIDATION ---
echo "✅ Succès: Binaire Chromium + Modules JS"
ls -lh "$BUILD_DIR/chrome" "$SCRAPER_ENGINE"