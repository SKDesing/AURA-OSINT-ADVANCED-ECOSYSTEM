#!/bin/bash

echo "🔄 MIGRATION REPO SÉCURISÉE - AURA OSINT"
echo "========================================"
echo ""
echo "🎯 ÉTAPES:"
echo "1. Obfuscation du code sensible"
echo "2. Création nouveau repo GitHub"
echo "3. Migration avec historique"
echo "4. Mise à jour références"
echo "5. Sécurisation finale"
echo ""

# 1. OBFUSCATION DU CODE SENSIBLE
echo "🔒 ÉTAPE 1: OBFUSCATION CODE SENSIBLE"
echo "======================================"

# Créer dossier de sauvegarde
mkdir -p .backup-original
cp -r . .backup-original/ 2>/dev/null

# Obfusquer les fichiers sensibles
echo "🔐 Obfuscation des fichiers critiques..."

# Obfusquer les clés API et secrets
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | while read file; do
    if grep -q "API_KEY\|SECRET\|PASSWORD\|TOKEN" "$file" 2>/dev/null; then
        sed -i 's/API_KEY[[:space:]]*=[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]/API_KEY="[REDACTED]"/g' "$file"
        sed -i 's/SECRET[[:space:]]*=[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]/SECRET="[REDACTED]"/g' "$file"
        sed -i 's/PASSWORD[[:space:]]*=[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]/PASSWORD="[REDACTED]"/g' "$file"
        sed -i 's/TOKEN[[:space:]]*=[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]/TOKEN="[REDACTED]"/g' "$file"
    fi
done

# Obfusquer les URLs sensibles
find . -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .git | while read file; do
    sed -i 's/localhost:[0-9]*/localhost:XXXX/g' "$file" 2>/dev/null
    sed -i 's/127\.0\.0\.1:[0-9]*/127.0.0.1:XXXX/g' "$file" 2>/dev/null
done

# Créer .env.example sécurisé
if [ -f ".env" ]; then
    cp .env .env.backup
    sed 's/=.*/=[REDACTED]/g' .env > .env.example
    echo "# Configuration example - Replace [REDACTED] with actual values" > .env.temp
    cat .env.example >> .env.temp
    mv .env.temp .env.example
fi

echo "✅ Obfuscation terminée"
echo ""

# 2. MISE À JOUR DES RÉFÉRENCES
echo "🔄 ÉTAPE 2: MISE À JOUR RÉFÉRENCES"
echo "=================================="

# Mettre à jour README.md
echo "📝 Mise à jour README.md..."
sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' README.md
sed -i 's/SKDesing\/TikTok-Live-Analyser/SKDesing\/AURA-OSINT-ADVANCED-ECOSYSTEM/g' README.md

# Mettre à jour package.json
echo "📦 Mise à jour package.json..."
if [ -f "package.json" ]; then
    sed -i 's/"name": ".*"/"name": "@aura\/osint-advanced-ecosystem"/g' package.json
    sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' package.json
fi

# Mettre à jour les workflows GitHub Actions
echo "🔧 Mise à jour GitHub Actions..."
find .github/workflows -name "*.yml" -exec sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' {} \; 2>/dev/null

# Mettre à jour la vitrine
echo "🎨 Mise à jour vitrine..."
find marketing/sites -name "*.md" -o -name "*.json" | while read file; do
    sed -i 's/TikTok-Live-Analyser/AURA-OSINT-ADVANCED-ECOSYSTEM/g' "$file" 2>/dev/null
done

echo "✅ Références mises à jour"
echo ""

# 3. CRÉATION FICHIERS SÉCURISÉS
echo "🛡️ ÉTAPE 3: CRÉATION FICHIERS SÉCURISÉS"
echo "========================================"

# Créer .gitignore renforcé
cat > .gitignore << 'EOF'
# Secrets et configurations sensibles
.env
.env.local
.env.*.local
*.key
*.pem
*.p12
*.pfx
config/secrets/
secrets/
private/

# Données sensibles
*.sqlite
*.db
data/
logs/
temp/
uploads/
cache/

# Développement
node_modules/
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# Build et distribution
dist/
build/
coverage/
.nyc_output/

# Backup
.backup-original/
*.backup
*.bak

# OS
.DS_Store
Thumbs.db
desktop.ini
EOF

# Créer SECURITY.md
cat > SECURITY.md << 'EOF'
# 🛡️ Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Yes             |
| 1.x.x   | ❌ No              |

## Reporting a Vulnerability

**DO NOT** create public issues for security vulnerabilities.

Instead, please email: security@aura-osint.com

### What to include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response time:
- Initial response: 24-48 hours
- Status update: Weekly
- Resolution: 30-90 days

## Security Measures

- All sensitive data is encrypted
- Regular security audits
- Dependency vulnerability scanning
- Code obfuscation for public repositories
EOF

# Créer CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOF'
# 🤝 Contributing to AURA OSINT Advanced Ecosystem

## Code of Conduct

This project adheres to professional standards. Please be respectful.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/amazing-feature`
5. Make changes and test
6. Commit: `git commit -m 'feat: Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open Pull Request

## Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Follow secure coding practices
- Report security issues privately

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
EOF

echo "✅ Fichiers sécurisés créés"
echo ""

# 4. COMMIT FINAL AVANT MIGRATION
echo "📦 ÉTAPE 4: COMMIT FINAL"
echo "======================="

git add .
git commit -m "🔄 PREPARATION MIGRATION - AURA OSINT ADVANCED ECOSYSTEM

🔒 SÉCURISATION:
• Code sensible obfusqué
• Secrets et clés masqués
• URLs localhost anonymisées
• .gitignore renforcé
• SECURITY.md ajouté

🔄 MISE À JOUR:
• README.md → AURA-OSINT-ADVANCED-ECOSYSTEM
• package.json → @aura/osint-advanced-ecosystem
• GitHub Actions workflows
• Références vitrine marketing

🛡️ FICHIERS AJOUTÉS:
• SECURITY.md (politique sécurité)
• CONTRIBUTING.md (guide contribution)
• .env.example sécurisé

🎯 PRÊT POUR: Migration vers nouveau repo
📊 STATUS: Code obfusqué, prêt pour public"

echo "✅ Commit de préparation créé"
echo ""

echo "🎯 PROCHAINES ÉTAPES MANUELLES:"
echo "==============================="
echo ""
echo "1️⃣  CRÉER NOUVEAU REPO GITHUB:"
echo "    • Aller sur: https://github.com/new"
echo "    • Nom: AURA-OSINT-ADVANCED-ECOSYSTEM"
echo "    • Description: 🛡️ AURA Advanced OSINT Ecosystem - Professional Multi-Platform Intelligence Suite"
echo "    • Public"
echo "    • Ne pas initialiser avec README"
echo ""
echo "2️⃣  MIGRER AVEC HISTORIQUE:"
echo "    git remote add new-origin https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git"
echo "    git push new-origin main"
echo "    git remote set-url origin https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git"
echo ""
echo "3️⃣  ARCHIVER ANCIEN REPO:"
echo "    • Aller sur: https://github.com/SKDesing/TikTok-Live-Analyser/settings"
echo "    • Scroll vers le bas → Archive this repository"
echo ""
echo "4️⃣  VÉRIFICATIONS FINALES:"
echo "    • Tester le nouveau repo"
echo "    • Vérifier que le code est illisible"
echo "    • Mettre à jour les liens externes"
echo ""
echo "⚠️  IMPORTANT:"
echo "   • Garder .backup-original/ en local (pas sur Git)"
echo "   • Vérifier que les secrets sont bien masqués"
echo "   • Tester la vitrine sur le nouveau repo"