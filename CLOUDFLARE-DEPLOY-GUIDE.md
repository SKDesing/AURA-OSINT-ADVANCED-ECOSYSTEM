# 🚀 Guide Déploiement Cloudflare Pages - AURA OSINT

## ✅ Build Testé et Fonctionnel

Le frontend a été testé et compile avec succès :
- **Build size**: 301.92 kB (gzipped)
- **Status**: ✅ Ready to deploy

---

## 📋 Configuration Cloudflare Pages

### 1. Connecter le Repository

1. Aller sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pages → Create a project
3. Connect to Git → Sélectionner `SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM`

### 2. Build Settings

```yaml
Project name: aura-osint-frontend
Production branch: main
Build command: cd clients/web/frontend && npm install && npm run build
Build output directory: clients/web/frontend/build
Root directory: (leave empty)
```

### 3. Environment Variables

```bash
NODE_VERSION=18
NODE_ENV=production
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_WS_URL=wss://your-backend-url.com
```

---

## 🔧 Fichiers de Configuration Déjà Présents

✅ `clients/web/frontend/public/_headers` - Headers de sécurité
✅ `clients/web/frontend/public/_redirects` - Redirections SPA
✅ `clients/web/frontend/public/index.html` - Page d'entrée

---

## 🌐 Options Backend

### Option 1: Cloudflare Tunnel (Gratuit - Recommandé pour dev)

```bash
# Installer cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authentifier
cloudflared tunnel login

# Créer tunnel
cloudflared tunnel create aura-backend

# Configurer DNS
cloudflared tunnel route dns aura-backend api.votre-domaine.com

# Lancer le tunnel
cloudflared tunnel run aura-backend --url http://localhost:4002
```

### Option 2: VPS Cloud (Production)

- **DigitalOcean**: $6/mois
- **Hetzner**: €4/mois  
- **Linode**: $5/mois

---

## 🚀 Déploiement

### Méthode Auto (Git Push)

```bash
git add .
git commit -m "Deploy to Cloudflare Pages"
git push origin main
```

Cloudflare détecte automatiquement et build.

### Méthode CLI (Wrangler)

```bash
# Installer Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
cd clients/web/frontend
npm run build
wrangler pages deploy build --project-name=aura-osint-frontend
```

---

## 🔒 Configuration CORS Backend

Ajouter dans `backend/api/analytics-api.js` :

```javascript
const allowedOrigins = [
  'https://aura-osint-frontend.pages.dev',
  'https://votre-domaine-custom.com',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
```

---

## 📊 Après Déploiement

1. **URL Production**: `https://aura-osint-frontend.pages.dev`
2. **Vérifier les logs** dans Cloudflare Dashboard
3. **Tester les endpoints API**
4. **Configurer domaine custom** (optionnel)

---

## 🧪 Test Local du Build

```bash
cd clients/web/frontend

# Build
npm run build

# Test local
npx serve -s build -p 8080

# Ouvrir http://localhost:8080
```

---

## ⚠️ Important

- **Frontend**: Cloudflare Pages (statique)
- **Backend**: Doit être hébergé séparément (VPS/Tunnel)
- **OSINT Tools**: Nécessitent un serveur Node.js complet

---

## 🆘 Troubleshooting

### Build échoue sur Cloudflare

```bash
# Tester localement d'abord
cd clients/web/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS Errors

Vérifier que le backend accepte l'origine Cloudflare Pages.

### WebSocket ne connecte pas

- Utiliser `wss://` (pas `ws://`)
- Backend doit supporter HTTPS/WSS

---

## 📚 Ressources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

**✅ Prêt pour le déploiement Cloudflare !**
