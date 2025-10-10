#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting AURA Browser (Electron)"

# Check if in development or production
if [ "${NODE_ENV:-development}" = "production" ]; then
    echo "📦 Production mode - launching packaged app"
    
    # Launch packaged Electron app
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a "AURA Browser"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        ./apps/browser-electron/dist/AURA\ Browser
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        ./apps/browser-electron/dist/AURA\ Browser.exe
    fi
else
    echo "🔧 Development mode - launching from source"
    
    # Check dependencies
    if ! command -v node >/dev/null 2>&1; then
        echo "❌ Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v pnpm >/dev/null 2>&1; then
        echo "❌ PNPM not found. Please install PNPM"
        exit 1
    fi
    
    # Install Electron dependencies if needed
    if [ ! -d "apps/browser-electron/node_modules" ]; then
        echo "📦 Installing Electron dependencies..."
        cd apps/browser-electron
        pnpm install
        cd ../..
    fi
    
    # Launch Electron in development
    cd apps/browser-electron
    pnpm run dev
fi