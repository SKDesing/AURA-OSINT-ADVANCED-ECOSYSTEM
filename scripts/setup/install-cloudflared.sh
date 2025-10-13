#!/bin/bash
# Installation Cloudflare Tunnel

echo "🔧 Installation Cloudflare Tunnel"
echo "=================================="

cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM

# Installer cloudflared
echo "📦 Installation de cloudflared..."
sudo dpkg -i cloudflared-linux-amd64.deb

# Vérifier
cloudflared --version

echo ""
echo "✅ Cloudflared installé !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. cloudflared tunnel login"
echo "2. cloudflared tunnel create aura-backend"
echo "3. cloudflared tunnel route dns aura-backend api.auraosintecosystem.io"
echo "4. npm start (dans un terminal)"
echo "5. cloudflared tunnel run aura-backend --url http://localhost:4002 (dans un autre terminal)"
