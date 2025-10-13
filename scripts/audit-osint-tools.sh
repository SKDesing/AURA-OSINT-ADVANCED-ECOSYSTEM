#!/bin/bash

echo "🔍 AUDIT COMPLET DES OUTILS OSINT"
echo "=================================="
echo ""

check_tool() {
    local name=$1
    local command=$2
    local path=$3
    
    if command -v $command &>/dev/null; then
        version=$(eval "$command --version 2>&1 | head -1" || echo "N/A")
        echo "✅ $name: INSTALLÉ"
        echo "   📍 Path: $(which $command)"
        echo "   📦 Version: $version"
        return 0
    elif [ -d "$path" ]; then
        echo "⚠️  $name: TROUVÉ ($path) mais pas dans PATH"
        return 1
    else
        echo "❌ $name: NON INSTALLÉ"
        return 2
    fi
}

echo "📦 OUTILS OSINT - SCAN COMPLET"
echo ""

# Outils OSINT
check_tool "TheHarvester" "theHarvest" "/opt/theHarvest"
check_tool "Sherlock" "sherlock" "/opt/sherlock"
check_tool "Maltego" "maltego" "/opt/Maltego"
check_tool "Recon-ng" "recon-ng" "/opt/recon-ng"
check_tool "SpiderFoot" "spiderfoot" "/opt/spiderfoot"
check_tool "Shodan CLI" "shodan" ""
check_tool "Amass" "amass" "/opt/amass"
check_tool "Subfinder" "subfinder" "/opt/subfinder"
check_tool "Nmap" "nmap" ""
check_tool "Whois" "whois" ""
check_tool "DNSRecon" "dnsrecon" "/opt/dnsrecon"
check_tool "Metagoofil" "metagoofil" "/opt/metagoofil"
check_tool "ExifTool" "exiftool" ""
check_tool "Photon" "photon" "/opt/photon"
check_tool "InstaLoader" "instaloader" ""
check_tool "Twint" "twint" "/opt/twint"
check_tool "Holehe" "holehe" "/opt/holehe"
check_tool "Maigret" "maigret" "/opt/maigret"

echo ""
echo "🔍 RECHERCHE DANS LES DOSSIERS STANDARDS..."
for dir in /opt /usr/local/bin ~/.local/bin ~/tools; do
    if [ -d "$dir" ]; then
        echo ""
        echo "📂 $dir:"
        ls -la "$dir" 2>/dev/null | grep -iE "osint|recon|sherlock|harvest|spider|amass|subfinder|holehe|maigret" | head -10
    fi
done

echo ""
echo "✅ AUDIT TERMINÉ"
