#!/bin/bash

echo "🔍 VÉRIFICATION SÉCURITÉ - AVANT MIGRATION"
echo "=========================================="
echo ""

# Vérifier les secrets exposés
echo "🔐 SCAN SECRETS EXPOSÉS:"
echo "========================"

secrets_found=0

# Chercher des patterns de secrets
echo "🔍 Recherche API keys..."
if grep -r "sk-[a-zA-Z0-9]" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null; then
    echo "⚠️  API keys trouvées!"
    secrets_found=1
fi

echo "🔍 Recherche tokens..."
if grep -r "ghp_[a-zA-Z0-9]" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null; then
    echo "⚠️  GitHub tokens trouvés!"
    secrets_found=1
fi

echo "🔍 Recherche mots de passe..."
if grep -ri "password.*=" . --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.git | grep -v "PASSWORD.*\[REDACTED\]" 2>/dev/null; then
    echo "⚠️  Mots de passe trouvés!"
    secrets_found=1
fi

echo "🔍 Recherche URLs sensibles..."
if grep -r "localhost:[0-9][0-9][0-9][0-9]" . --exclude-dir=node_modules --exclude-dir=.git | grep -v "localhost:XXXX" 2>/dev/null; then
    echo "⚠️  URLs localhost non obfusquées!"
    secrets_found=1
fi

if [ $secrets_found -eq 0 ]; then
    echo "✅ Aucun secret exposé détecté"
else
    echo "❌ SECRETS DÉTECTÉS - OBFUSCATION REQUISE!"
fi

echo ""

# Vérifier la structure du code
echo "📁 VÉRIFICATION STRUCTURE:"
echo "=========================="

echo "📊 Taille du repo:"
du -sh . 2>/dev/null | head -1

echo "📊 Nombre de fichiers:"
find . -type f ! -path "./.git/*" ! -path "./node_modules/*" | wc -l

echo "📊 Langages détectés:"
find . -name "*.js" ! -path "./node_modules/*" ! -path "./.git/*" | wc -l | xargs echo "JavaScript:"
find . -name "*.jsx" ! -path "./node_modules/*" ! -path "./.git/*" | wc -l | xargs echo "React:"
find . -name "*.ts" ! -path "./node_modules/*" ! -path "./.git/*" | wc -l | xargs echo "TypeScript:"
find . -name "*.py" ! -path "./node_modules/*" ! -path "./.git/*" | wc -l | xargs echo "Python:"

echo ""

# Vérifier les fichiers sensibles
echo "🛡️ FICHIERS SENSIBLES:"
echo "======================"

if [ -f ".env" ]; then
    echo "⚠️  .env présent - sera ignoré par Git"
fi

if [ -f ".env.example" ]; then
    echo "✅ .env.example présent"
fi

if [ -f "SECURITY.md" ]; then
    echo "✅ SECURITY.md présent"
else
    echo "❌ SECURITY.md manquant"
fi

if [ -f ".gitignore" ]; then
    echo "✅ .gitignore présent"
    echo "   Lignes: $(wc -l < .gitignore)"
else
    echo "❌ .gitignore manquant"
fi

echo ""

# Vérifier les références au nom
echo "🔄 VÉRIFICATION RÉFÉRENCES:"
echo "==========================="

old_refs=$(grep -r "TikTok-Live-Analyser" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.backup-original 2>/dev/null | wc -l)
echo "Références 'TikTok-Live-Analyser': $old_refs"

if [ $old_refs -gt 0 ]; then
    echo "⚠️  Références à l'ancien nom trouvées:"
    grep -r "TikTok-Live-Analyser" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.backup-original 2>/dev/null | head -5
fi

echo ""

# Score de sécurité
echo "📊 SCORE SÉCURITÉ:"
echo "=================="

score=100

if [ $secrets_found -gt 0 ]; then
    score=$((score - 30))
    echo "❌ Secrets exposés (-30 points)"
fi

if [ $old_refs -gt 0 ]; then
    score=$((score - 10))
    echo "⚠️  Références ancien nom (-10 points)"
fi

if [ ! -f "SECURITY.md" ]; then
    score=$((score - 10))
    echo "❌ SECURITY.md manquant (-10 points)"
fi

if [ ! -f ".env.example" ]; then
    score=$((score - 5))
    echo "❌ .env.example manquant (-5 points)"
fi

echo ""
echo "🎯 SCORE FINAL: $score/100"

if [ $score -ge 90 ]; then
    echo "✅ EXCELLENT - Prêt pour migration publique"
elif [ $score -ge 70 ]; then
    echo "⚠️  BON - Quelques améliorations recommandées"
else
    echo "❌ INSUFFISANT - Sécurisation requise avant migration"
fi

echo ""
echo "🎯 RECOMMANDATIONS:"
echo "=================="

if [ $secrets_found -gt 0 ]; then
    echo "• Obfusquer tous les secrets détectés"
fi

if [ $old_refs -gt 0 ]; then
    echo "• Mettre à jour toutes les références au nom"
fi

if [ ! -f "SECURITY.md" ]; then
    echo "• Créer SECURITY.md"
fi

echo "• Vérifier manuellement les fichiers sensibles"
echo "• Tester la vitrine après migration"
echo "• Archiver l'ancien repo après migration"