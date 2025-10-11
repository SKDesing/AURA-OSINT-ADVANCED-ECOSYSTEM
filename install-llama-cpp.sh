#!/bin/bash
# Installation llama.cpp sans sudo

echo "🔧 Installation llama.cpp..."

# Créer les dossiers
mkdir -p ai/local-llm/runtime

# Cloner llama.cpp
cd ai/local-llm/runtime
if [ ! -d "llama.cpp" ]; then
    git clone https://github.com/ggerganov/llama.cpp.git
fi

cd llama.cpp

# Compiler
make clean
make -j$(nproc)

echo "✅ llama.cpp compilé!"
echo "📁 Binaire: $(pwd)/server"