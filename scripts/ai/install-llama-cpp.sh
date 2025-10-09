#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installing llama.cpp for AURA OSINT"
echo "======================================"

LLAMA_DIR="ai/local-llm/runtime/llama.cpp"
LLAMA_REPO="https://github.com/ggerganov/llama.cpp.git"

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v git >/dev/null 2>&1 || { echo "❌ git required"; exit 1; }
command -v cmake >/dev/null 2>&1 || { echo "❌ cmake required"; exit 1; }
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

# Clone or update llama.cpp
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
    CMAKE_FLAGS="-DLLAMA_AVX2=ON"
else
    echo "⚠️  No AVX2 support, using basic optimizations"
    CMAKE_FLAGS=""
fi

# Build
echo "🔨 Building llama.cpp..."
mkdir -p build
cd build

cmake .. $CMAKE_FLAGS -DLLAMA_BUILD_SERVER=ON -DCMAKE_BUILD_TYPE=Release
make -j$(nproc 2>/dev/null || echo 4) llama-server

# Auto-detect server binary (new convention)
mkdir -p bin
if [ -f "llama-server" ]; then
    ln -sf "../llama-server" "bin/server"
    echo "✅ llama.cpp server built successfully (llama-server)"
elif [ -f "bin/llama-server" ]; then
    ln -sf "llama-server" "bin/server"
    echo "✅ llama.cpp server built successfully (bin/llama-server)"
elif [ -f "server" ]; then
    ln -sf "../server" "bin/server"
    echo "✅ llama.cpp server built successfully (server)"
else
    echo "❌ Build failed - no server binary found"
    ls -la . | grep -E "(server|llama)"
    exit 1
fi

echo "📍 Binary location: $(pwd)/bin/server"
echo "🔗 Ready for Qwen execution"

echo ""
echo "🎉 llama.cpp installation completed"
echo "   Ready for Qwen model execution"