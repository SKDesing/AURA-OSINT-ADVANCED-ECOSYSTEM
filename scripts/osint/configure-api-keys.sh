#!/usr/bin/env bash
set -euo pipefail

echo "🔑 Configuration des clés API OSINT"

CONFIG_DIR="$HOME/.config/osint"
mkdir -p "$CONFIG_DIR"

echo "Configurez vos clés API gratuites:"
echo "1. Shodan: https://account.shodan.io/"
echo "2. Censys: https://censys.io/register"
echo "3. VirusTotal: https://www.virustotal.com/gui/join-us"
echo "4. SecurityTrails: https://securitytrails.com/corp/api"
echo "5. Hunter.io: https://hunter.io/api"

read -p "Clé Shodan (optionnel): " SHODAN_KEY
read -p "Clé Censys ID (optionnel): " CENSYS_ID
read -p "Clé Censys Secret (optionnel): " CENSYS_SECRET
read -p "Clé VirusTotal (optionnel): " VT_KEY

# Configuration recon-ng
if [ -n "$SHODAN_KEY" ]; then
  echo "keys add shodan_api $SHODAN_KEY" > "$CONFIG_DIR/recon-ng-setup.rc"
fi
if [ -n "$VT_KEY" ]; then
  echo "keys add virustotal_api $VT_KEY" >> "$CONFIG_DIR/recon-ng-setup.rc"
fi

# Configuration theHarvester
cat > "$CONFIG_DIR/api-keys.yaml" << EOF
apikeys:
  shodan: ${SHODAN_KEY:-}
  censys:
    id: ${CENSYS_ID:-}
    secret: ${CENSYS_SECRET:-}
  virustotal: ${VT_KEY:-}
EOF

echo "✅ Configuration sauvegardée dans $CONFIG_DIR"