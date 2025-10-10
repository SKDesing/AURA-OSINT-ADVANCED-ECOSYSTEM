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
