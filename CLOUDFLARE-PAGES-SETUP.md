# ☁️ Configuration Cloudflare Pages - AURA OSINT

## 🚀 Configuration Rapide

### Dans le Dashboard Cloudflare Pages

**1. Paramètres de Base**
```
Nom du projet:              aura-osint-frontend
URL production:             aura-osint-frontend.pages.dev
Repository:                 SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM
Branche production:         main (ou chore/upgrade-electron-38)
```

**2. Build Settings**
```
Framework preset:           Create React App
Build command:              cd clients/web/frontend && npm install && npm run build
Build output directory:     clients/web/frontend/build
Root directory:             /
Node version:               18
```

**3. Variables d'Environnement**

**Production:**
```
NODE_VERSION=18
NODE_ENV=production
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_WS_URL=wss://your-backend-url.com
```

**Preview (optionnel):**
```
NODE_VERSION=18
NODE_ENV=staging
REACT_APP_API_URL=https://staging-api.your-domain.com
REACT_APP_WS_URL=wss://staging-api.your-domain.com
```

---

## 📋 Checklist Déploiement

- [ ] Repository GitHub connecté à Cloudflare
- [ ] Build settings configurés
- [ ] Variables d'environnement ajoutées
- [ ] `_headers` et `_redirects` dans `public/`
- [ ] Premier build lancé
- [ ] URL testée: https://aura-osint-frontend.pages.dev
- [ ] Backend CORS configuré pour accepter le domaine Pages

---

## ⚙️ Configuration Backend CORS

Le backend doit accepter les requêtes depuis Cloudflare Pages :

```javascript
// backend/server.js ou équivalent
const cors = require('cors');

app.use(cors({
  origin: [
    'https://aura-osint-frontend.pages.dev',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
}));
```

---

## 🔗 Options Backend

### Option 1: VPS/Cloud (Recommandé)
- DigitalOcean Droplet ($6/mois)
- Linode ($5/mois)
- Hetzner Cloud (€4/mois)
- AWS EC2 / GCP Compute / Azure VM

### Option 2: Cloudflare Tunnel (Gratuit)
Expose ton backend local via tunnel sécurisé :

```bash
# Installer cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

# Créer tunnel
cloudflared tunnel login
cloudflared tunnel create aura-backend
cloudflared tunnel route dns aura-backend api.your-domain.com

# Lancer tunnel
cloudflared tunnel run aura-backend --url http://localhost:3000
```

### Option 3: Serverless (Avancé)
- Cloudflare Workers
- AWS Lambda + API Gateway
- Vercel Serverless Functions

---

## 🧪 Test Local Avant Déploiement

```bash
cd clients/web/frontend

# Installer dépendances
npm install

# Build production
npm run build

# Vérifier que build/ existe
ls -la build/

# Test local du build
npx serve -s build -p 8080
```

---

## 🚀 Déploiement

### Méthode 1: Auto (via Git)
```bash
git add .
git commit -m "Configure Cloudflare Pages"
git push origin main
```
→ Cloudflare build automatiquement

### Méthode 2: Manuel (CLI)
```bash
npm install -g wrangler
wrangler pages deploy clients/web/frontend/build --project-name=aura-osint-frontend
```

---

## 📊 Après Déploiement

1. **Tester l'URL**: https://aura-osint-frontend.pages.dev
2. **Vérifier les logs** dans Cloudflare Dashboard
3. **Configurer domaine custom** (optionnel)
4. **Activer Web Analytics** (gratuit)

---

## ⚠️ Important

**Le backend (API + OSINT tools) doit être hébergé séparément !**

Cloudflare Pages = Frontend statique uniquement
Backend = Serveur Node.js avec outils OSINT

---

## 🆘 Troubleshooting

### Build échoue
```bash
# Vérifier localement
cd clients/web/frontend
npm install
npm run build
```

### CORS errors
```javascript
// Ajouter dans backend
app.use(cors({
  origin: 'https://aura-osint-frontend.pages.dev'
}));
```

### WebSocket ne connecte pas
- Vérifier `REACT_APP_WS_URL` commence par `wss://`
- Backend doit supporter WSS (HTTPS)

---

## 📚 Ressources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---

**Prêt à déployer ! 🚀**
