#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installing llama.cpp (NO CMAKE) for AURA OSINT"
echo "================================================="

LLAMA_DIR="ai/local-llm/runtime/llama.cpp"
LLAMA_REPO="https://github.com/ggerganov/llama.cpp.git"

# Check prerequisites (minimal)
echo "📋 Checking prerequisites..."
command -v git >/dev/null 2>&1 || { echo "❌ git required"; exit 1; }
command -v make >/dev/null 2>&1 || { echo "❌ make required"; exit 1; }

# Check for compiler
if command -v gcc >/dev/null 2>&1; then
    echo "✅ Found gcc: $(gcc --version | head -1)"
elif command -v clang >/dev/null 2>&1; then
    echo "✅ Found clang: $(clang --version | head -1)"
else
    echo "❌ No C++ compiler found (gcc or clang required)"
    exit 1
fi

# Create directory
mkdir -p "$(dirname "$LLAMA_DIR")"

# Clone llama.cpp
if [ -d "$LLAMA_DIR" ]; then
    echo "📁 Updating existing llama.cpp..."
    cd "$LLAMA_DIR"
    git pull origin master
else
    echo "📥 Cloning llama.cpp..."
    git clone "$LLAMA_REPO" "$LLAMA_DIR"
    cd "$LLAMA_DIR"
fi

# Check for AVX2 support
if grep -q avx2 /proc/cpuinfo 2>/dev/null; then
    echo "✅ AVX2 support detected"
    CFLAGS="-mavx2 -mfma"
else
    echo "⚠️  No AVX2 support, using basic optimizations"
    CFLAGS=""
fi

# Build using make directly (no cmake)
echo "🔨 Building llama.cpp with make..."
make clean || true
LLAMA_SERVER_VERBOSE=1 make server CFLAGS="$CFLAGS -O3"

# Verify build
if [ -f "server" ]; then
    echo "✅ llama.cpp server built successfully"
    echo "📍 Binary location: $(pwd)/server"
    
    # Create directory structure expected by run script
    mkdir -p build/bin
    cp server build/bin/server
    
    echo "🔗 Binary copied to: $(pwd)/build/bin/server"
else
    echo "❌ Build failed - server binary not found"
    exit 1
fi

echo ""
echo "🎉 llama.cpp installation completed (NO CMAKE)"
echo "   Ready for Qwen model execution"