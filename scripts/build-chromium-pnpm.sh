#!/bin/bash
# AURA Browser - Build Script avec PNPM Integration
# Chromium + PNPM Coexistence

set -e

echo "🚀 AURA BROWSER BUILD - CHROMIUM + PNPM"
echo "======================================"

# Configuration
CHROMIUM_DIR="01_CORE/aura_browser"
BUILD_DIR="$CHROMIUM_DIR/out/Default"

# Étape 1: Vérification environnement
echo "🔍 Vérification environnement..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ PNPM non installé!"
    exit 1
fi

if ! command -v gn &> /dev/null; then
    echo "⚠️ GN non trouvé, installation..."
    sudo apt-get update
    sudo apt-get install -y ninja-build python3 git
fi

# Étape 2: Setup structure
echo "📁 Setup structure projet..."
mkdir -p $CHROMIUM_DIR/src
mkdir -p $CHROMIUM_DIR/build
mkdir -p $CHROMIUM_DIR/out

# Étape 3: Build Chromium (isolé)
echo "🔧 Build Chromium..."
cd $CHROMIUM_DIR

# Configuration GN
cat > build/args.gn << 'EOF'
is_debug = false
is_component_build = false
symbol_level = 0
enable_nacl = false
remove_webcore_debug_symbols = true
proprietary_codecs = true
ffmpeg_branding = "Chrome"
use_ozone = true
EOF

# Génération build files
gn gen out/Default --args="$(cat build/args.gn | tr '\n' ' ')"

# Compilation avec Ninja
ninja -C out/Default chrome -j$(nproc)

cd ../..

# Étape 4: Build packages JS avec PNPM
echo "📦 Build packages JavaScript..."
pnpm install
pnpm run build

# Étape 5: Intégration Chromium -> Frontend
echo "🔗 Intégration Chromium..."
if [ -f "$BUILD_DIR/chrome" ]; then
    cp "$BUILD_DIR/chrome" clients/web-react/public/aura-browser
    chmod +x clients/web-react/public/aura-browser
    echo "✅ AURA Browser intégré au frontend"
else
    echo "❌ Build Chromium échoué!"
    exit 1
fi

# Étape 6: Validation
echo "🧪 Validation build..."
$BUILD_DIR/chrome --version
pnpm run test

echo "🎉 BUILD COMPLET - AURA BROWSER READY!"