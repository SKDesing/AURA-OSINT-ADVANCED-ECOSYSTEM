#!/bin/bash

echo "🧪 TEST OPÉRATIONNELS - OUTILS OSINT"
echo "===================================="
echo ""

PASS=0
FAIL=0

test_tool() {
    local name=$1
    local cmd=$2
    
    echo -n "Testing $name... "
    if eval "$cmd" &>/dev/null; then
        echo "✅ OK"
        ((PASS++))
    else
        echo "❌ FAIL"
        ((FAIL++))
    fi
}

echo "📧 EMAIL TOOLS"
test_tool "Holehe" "holehe --help"

echo ""
echo "👤 SOCIAL MEDIA TOOLS"
test_tool "Sherlock" "sherlock --version"
test_tool "Maigret" "maigret --version"
test_tool "Instaloader" "instaloader --version"

echo ""
echo "🌐 NETWORK/DOMAIN TOOLS"
test_tool "TheHarvester" "theHarvester -h"
test_tool "Subfinder" "subfinder -version"
test_tool "Amass" "amass -version"
test_tool "Nmap" "nmap --version"
test_tool "WHOIS" "whois --version"
test_tool "DNSenum" "dnsenum --help"
test_tool "DNSrecon" "dnsrecon --version"
test_tool "Fierce" "fierce -h"

echo ""
echo "🖼️ IMAGE/METADATA TOOLS"
test_tool "ExifTool" "exiftool -ver"

echo ""
echo "🕵️ DARKNET/TOR TOOLS"
test_tool "Tor" "tor --version"
test_tool "Torsocks" "torsocks --version"

echo ""
echo "📊 RÉSUMÉ"
echo "========"
TOTAL=$((PASS + FAIL))
PERCENT=$((PASS * 100 / TOTAL))
echo "Total: $TOTAL"
echo "Opérationnels: $PASS ✅"
echo "Non-opérationnels: $FAIL ❌"
echo "Taux: $PERCENT%"

if [ $PERCENT -ge 80 ]; then
    echo ""
    echo "🎉 EXCELLENT - Prêt pour production"
elif [ $PERCENT -ge 60 ]; then
    echo ""
    echo "⚠️ BON - Quelques outils à installer"
else
    echo ""
    echo "❌ INSUFFISANT - Installation requise"
fi
