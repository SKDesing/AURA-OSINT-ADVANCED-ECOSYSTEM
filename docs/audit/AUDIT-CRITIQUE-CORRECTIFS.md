# 🚨 CORRECTIFS CRITIQUES - PLAN D'EXÉCUTION

## 🔴 PHASE 1: VULNÉRABILITÉS CRITIQUES (2h)

### 1. SQL Injection - Analytics API
```bash
# Fichier: backend/api/analytics-api.js
# Remplacer lignes 36-40 par requêtes paramétrées
npm install joi
```

### 2. CORS Policy
```javascript
// Remplacer ligne 9 par:
res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || 'http://localhost:3000');
```

### 3. Mailtrap Credentials
```bash
# Supprimer .env de git et utiliser variables d'environnement
git rm marketing/sites/vitrine-aura-advanced-osint-ecosystem/backend/.env
echo "*.env" >> .gitignore
```

## 🟡 PHASE 2: VULNÉRABILITÉS HAUTES (4h)

### 4. JWT Algorithm
```javascript
// Dans auth.js ligne 25, ajouter:
const decoded = jwt.verify(token, AUTH_CONFIG.jwtSecret, { algorithms: ['HS256'] });
```

### 5. Password Hash
```bash
# Déplacer vers variables d'environnement
export ROOT_PASSWORD_HASH="$2b$12$..."
```

### 6. Command Injection
```javascript
// Remplacer exec par spawn avec validation
const { spawn } = require('child_process');
```

### 7. Security Headers
```nginx
# Ajouter dans nginx.conf:
add_header Content-Security-Policy "default-src 'self'";
add_header X-Frame-Options "DENY";
add_header Strict-Transport-Security "max-age=31536000";
```

## 📊 TESTS DE VALIDATION

### Test SQL Injection
```bash
curl -X POST http://localhost:4002/api/analytics/cross-platform-search \
  -H "Content-Type: application/json" \
  -d '{"query": "'; DROP TABLE targets; --"}'
# Doit retourner: 400 Bad Request
```

### Test JWT None Algorithm
```bash
# Token avec alg: none
curl -H "Authorization: Bearer eyJhbGciOiJub25lIn0..." http://localhost:4001/api/status
# Doit retourner: 401 Unauthorized
```

### Test CORS
```bash
curl -H "Origin: https://malicious.com" http://localhost:4002/api/analytics/dashboard
# Doit retourner: CORS error
```

## 🎯 CHECKLIST FINAL
- [ ] SQL Injection corrigé et testé
- [ ] CORS restreint aux domaines autorisés  
- [ ] Credentials supprimés du code source
- [ ] JWT algorithm forcé à HS256
- [ ] Password hash déplacé vers ENV
- [ ] Command injection sécurisé
- [ ] Security headers ajoutés
- [ ] Tests de validation passés
- [ ] Documentation mise à jour

**PRIORITÉ ABSOLUE**: Corriger les 3 vulnérabilités CRITIQUES avant tout déploiement.