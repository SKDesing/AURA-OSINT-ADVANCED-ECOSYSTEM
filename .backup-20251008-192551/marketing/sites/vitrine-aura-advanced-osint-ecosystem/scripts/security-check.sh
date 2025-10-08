#!/bin/bash
set -euo pipefail

echo "🔍 Vérification de sécurité AURA ADVANCED OSINT ECOSYSTEM..."

# Check 1: Secrets exposés
echo "1️⃣ Scan des secrets..."
if find . -name "*.env*" -not -path "./node_modules/*" | head -1 | grep -q .; then
  echo "⚠️  Fichiers .env détectés!"
  find . -name "*.env*" -not -path "./node_modules/*"
fi

# Check 2: Clés privées
echo "2️⃣ Scan des clés privées..."
if find . -name "*.key" -o -name "*.pem" | grep -v node_modules | head -1 | grep -q .; then
  echo "⚠️  Clés privées détectées!"
  find . -name "*.key" -o -name "*.pem" | grep -v node_modules
fi

# Check 3: npm audit
echo "3️⃣ Audit npm..."
npm audit --audit-level moderate || echo "⚠️  Vulnérabilités détectées"

# Check 4: Vérification des permissions de fichiers
echo "4️⃣ Vérification des permissions..."
find . -type f -perm 777 -not -path "./node_modules/*" | head -5

# Check 5: Scan des hardcoded secrets
echo "5️⃣ Scan des secrets hardcodés..."
if grep -r "password\|secret\|token\|api_key" src/ --include="*.js" --include="*.jsx" | grep -v "placeholder\|example" | head -3 | grep -q .; then
  echo "⚠️  Secrets potentiels dans le code!"
fi

echo "✅ Vérification de sécurité terminée!"