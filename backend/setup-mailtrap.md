# 📧 Configuration Mailtrap pour AURA OSINT

## 🎯 Problème Résolu
L'erreur `535 5.7.0 Invalid credentials` indique que les credentials Mailtrap sont incorrects.

## ✅ Solution

### 1. Obtenez vos vrais credentials Mailtrap
```bash
# Connectez-vous à https://mailtrap.io
# Allez dans "Email Testing" > "Inboxes"
# Sélectionnez votre inbox
# Cliquez sur "SMTP Settings"
# Copiez Username et Password
```

### 2. Mettez à jour .env.mailtrap
```ini
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=VOTRE_VRAI_USERNAME
EMAIL_PASSWORD=VOTRE_VRAI_PASSWORD
EMAIL_FROM=noreply@aura-osint.com
FRONTEND_URL=http://localhost:3000
```

### 3. Testez la configuration
```bash
cd backend
node test-email.js
```

## 🔧 Scripts Disponibles
- `test-email.js` - Test avec variables d'environnement
- `test-mailtrap-demo.js` - Test avec credentials hardcodés
- `.env.mailtrap.example` - Fichier exemple

## 📝 Notes
- Username format: `91a6345a1b8416` (exemple)
- Password format: `b8c4e1ce4f2a3d` (exemple complet)
- Le mot de passe doit être complet (pas de `****`)

## ✅ Validation
Une fois configuré correctement, vous devriez voir:
```
✅ Email envoyé avec succès!
📧 Message ID: <message-id>
📨 Vérifiez votre inbox Mailtrap
```