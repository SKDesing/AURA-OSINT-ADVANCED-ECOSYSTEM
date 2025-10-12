#!/bin/bash

# 🔍 AUDIT COMPLET - OUTILS OSINT MANQUANTS
echo "🔍 AUDIT COMPLET - OUTILS OSINT MANQUANTS"
echo "========================================"

# Outils Email
echo -e "\n📧 EMAIL TOOLS:"
command -v holehe >/dev/null && echo "✅ Holehe" || echo "❌ Holehe"
command -v h8mail >/dev/null && echo "✅ H8mail" || echo "❌ H8mail"
command -v emailrep >/dev/null && echo "✅ EmailRep" || echo "❌ EmailRep"
command -v ghunt >/dev/null && echo "✅ GHunt" || echo "❌ GHunt"

# Outils Phone
echo -e "\n📱 PHONE TOOLS:"
command -v phoneinfoga >/dev/null && echo "✅ PhoneInfoga" || echo "❌ PhoneInfoga"
command -v phonenumbers >/dev/null && echo "✅ PhoneNumbers" || echo "❌ PhoneNumbers"

# Outils Social Media
echo -e "\n👤 SOCIAL MEDIA TOOLS:"
command -v sherlock >/dev/null && echo "✅ Sherlock" || echo "❌ Sherlock"
command -v maigret >/dev/null && echo "✅ Maigret" || echo "❌ Maigret"
command -v socialscan >/dev/null && echo "✅ SocialScan" || echo "❌ SocialScan"
command -v twint >/dev/null && echo "✅ Twint" || echo "❌ Twint"
command -v instaloader >/dev/null && echo "✅ Instaloader" || echo "❌ Instaloader"

# Outils Network/Domain
echo -e "\n🌐 NETWORK/DOMAIN TOOLS:"
command -v theHarvester >/dev/null && echo "✅ TheHarvester" || echo "❌ TheHarvester"
command -v subfinder >/dev/null && echo "✅ Subfinder" || echo "❌ Subfinder"
command -v amass >/dev/null && echo "✅ Amass" || echo "❌ Amass"
command -v nmap >/dev/null && echo "✅ Nmap" || echo "❌ Nmap"
command -v whois >/dev/null && echo "✅ WHOIS" || echo "❌ WHOIS"
command -v dnsenum >/dev/null && echo "✅ DNSenum" || echo "❌ DNSenum"
command -v dnsrecon >/dev/null && echo "✅ DNSrecon" || echo "❌ DNSrecon"
command -v fierce >/dev/null && echo "✅ Fierce" || echo "❌ Fierce"
command -v masscan >/dev/null && echo "✅ Masscan" || echo "❌ Masscan"

# Outils Breach/Leak
echo -e "\n💥 BREACH/LEAK TOOLS:"
command -v bbot >/dev/null && echo "✅ BBOT" || echo "❌ BBOT"
command -v dehashed >/dev/null && echo "✅ DeHashed" || echo "❌ DeHashed"

# Outils Image/Metadata
echo -e "\n🖼️ IMAGE/METADATA TOOLS:"
command -v exiftool >/dev/null && echo "✅ ExifTool" || echo "❌ ExifTool"
command -v binwalk >/dev/null && echo "✅ Binwalk" || echo "❌ Binwalk"

# Outils Darknet/Tor
echo -e "\n🕵️ DARKNET/TOR TOOLS:"
command -v tor >/dev/null && echo "✅ Tor" || echo "❌ Tor"
command -v torsocks >/dev/null && echo "✅ Torsocks" || echo "❌ Torsocks"
command -v onionscan >/dev/null && echo "✅ OnionScan" || echo "❌ OnionScan"

# Outils Crypto
echo -e "\n₿ CRYPTO TOOLS:"
command -v btcrecover >/dev/null && echo "✅ BTCRecover" || echo "❌ BTCRecover"
command -v blockchain-explorer >/dev/null && echo "✅ Blockchain Explorer" || echo "❌ Blockchain Explorer"

echo -e "\n📊 RÉSUMÉ:"
TOTAL=0
INSTALLED=0

for tool in holehe h8mail emailrep ghunt phoneinfoga phonenumbers sherlock maigret socialscan twint instaloader theHarvester subfinder amass nmap whois dnsenum dnsrecon fierce masscan bbot dehashed exiftool binwalk tor torsocks onionscan btcrecover blockchain-explorer; do
    TOTAL=$((TOTAL + 1))
    if command -v $tool >/dev/null 2>&1; then
        INSTALLED=$((INSTALLED + 1))
    fi
done

echo "Total outils: $TOTAL"
echo "Installés: $INSTALLED"
echo "Manquants: $((TOTAL - INSTALLED))"
echo "Taux: $((INSTALLED * 100 / TOTAL))%"