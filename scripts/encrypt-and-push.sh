#!/bin/bash
# AURA OSINT - Encrypted Push Script
# Encrypts all sensitive files before Git push

set -e

echo "🔐 AURA ENCRYPTION & PUSH SYSTEM"

# Generate encryption key if not exists
if [ ! -f ".aura-key" ]; then
    openssl rand -base64 32 > .aura-key
    chmod 600 .aura-key
    echo "✅ Encryption key generated"
fi

KEY=$(cat .aura-key)

# Files to encrypt
SENSITIVE_FILES=(
    "PROJECT-TITAN-ACTIVATED.md"
    "MITM-STEALTH-ARCHITECTURE.md"
    "AURA-SECURITY-CHECKLIST.md"
    "REVOLUTION-ANALYSIS-TITAN.md"
    "config/aura-config.json"
    "scripts/build_aura.sh"
    "AURA-BROWSER-DIRECTIVE-RESPONSE.md"
)

# Encrypt sensitive files
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "🔒 Encrypting $file..."
        openssl enc -aes-256-cbc -salt -in "$file" -out "${file}.enc" -k "$KEY"
        rm "$file"
        echo "✅ $file encrypted and original removed"
    fi
done

# Create decryption script
cat > decrypt-aura.sh << 'EOF'
#!/bin/bash
# AURA Decryption Script - AUTHORIZED PERSONNEL ONLY

if [ ! -f ".aura-key" ]; then
    echo "❌ Encryption key not found!"
    exit 1
fi

KEY=$(cat .aura-key)

# Decrypt all .enc files
for file in *.enc **/*.enc; do
    if [ -f "$file" ]; then
        original="${file%.enc}"
        echo "🔓 Decrypting $original..."
        openssl enc -aes-256-cbc -d -in "$file" -out "$original" -k "$KEY"
        echo "✅ $original decrypted"
    fi
done

echo "🎯 All AURA files decrypted successfully!"
EOF

chmod +x decrypt-aura.sh

# Add to .gitignore
cat >> .gitignore << 'EOF'
# AURA Security
.aura-key
decrypt-aura.sh
EOF

# Git operations
git add .
git commit -m "🔐 AURA OSINT: Encrypted sensitive files - CONFIDENTIAL/NOFORN"
git push origin main

echo "🚀 AURA files encrypted and pushed to repository!"
echo "🔑 Decryption key stored locally in .aura-key"
echo "⚠️  KEEP .aura-key SECURE - Required for decryption!"