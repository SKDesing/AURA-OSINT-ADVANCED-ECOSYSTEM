#!/bin/bash
# Installation llama.cpp avec CMake

echo "🔧 Installation llama.cpp avec CMake..."

cd ai/local-llm/runtime/llama.cpp

# Créer dossier build
mkdir -p build
cd build

# Compiler avec CMake
cmake .. -DLLAMA_BUILD_SERVER=ON
make -j$(nproc)

echo "✅ llama.cpp compilé avec CMake!"
echo "📁 Binaire: $(pwd)/bin/server"