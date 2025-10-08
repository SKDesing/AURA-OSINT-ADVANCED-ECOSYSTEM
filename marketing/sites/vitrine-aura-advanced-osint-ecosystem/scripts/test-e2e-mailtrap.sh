#!/bin/bash
set -euo pipefail

echo "🧪 Test end-to-end avec Mailtrap..."

# 1. Démarrer le backend
echo "🚀 Démarrage backend..."
cd backend
npm start &
BACKEND_PID=$!
sleep 3

# 2. Tester l'endpoint health
echo "🏥 Test health check..."
curl -s http://localhost:5000/api/health | jq '.'

# 3. Tester l'envoi d'email
echo "📧 Test envoi email..."
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test E2E",
    "email": "test@example.com",
    "subject": "Test automatisé AURA",
    "message": "Ceci est un test end-to-end automatisé depuis la vitrine AURA ADVANCED OSINT ECOSYSTEM"
  }' | jq '.'

# 4. Vérifier la réponse
if [ $? -eq 0 ]; then
  echo "✅ Email envoyé avec succès!"
  echo "📬 Vérifie Mailtrap: https://mailtrap.io/inboxes"
else
  echo "❌ Erreur lors de l'envoi"
fi

# 5. Arrêter le backend
kill $BACKEND_PID

echo "✅ Test terminé!"