# 🚀 Déploiement GRATUIT - Sans Domaine

## ✅ Solution 100% Gratuite

Cloudflare Pages vous donne un domaine gratuit automatiquement !

---

## 🌐 Votre Site Sera Sur

```
https://aura-osint.pages.dev
```

**Gratuit, HTTPS automatique, CDN mondial !**

---

## 📋 Déploiement en 5 Minutes

### 1. Aller sur Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pages → **Create a project**
3. **Connect to Git**

### 2. Connecter GitHub

1. Sélectionner votre compte GitHub
2. Choisir le repo: `SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM`
3. Autoriser Cloudflare

### 3. Configuration Build

```yaml
Project name: aura-osint
Production branch: main
Build command: cd clients/web/frontend && npm install && npm run build
Build output directory: clients/web/frontend/build
```

### 4. Variables d'environnement (optionnel)

```bash
NODE_VERSION=18
NODE_ENV=production
```

### 5. Deploy !

Cliquer sur **Save and Deploy**

⏱️ Build: ~3-5 minutes

---

## 🎉 Résultat

**Frontend**: `https://aura-osint.pages.dev` (GRATUIT)

**Backend**: 2 options

### Option 1: Localhost uniquement (Gratuit)
```bash
npm start
# Accessible uniquement sur votre machine
```

### Option 2: Cloudflare Tunnel (Gratuit)
```bash
# Installer cloudflared
./scripts/setup/install-cloudflared.sh

# Authentifier
cloudflared tunnel login

# Créer tunnel
cloudflared tunnel create aura-backend

# Lancer backend
npm start

# Exposer via tunnel
cloudflared tunnel run aura-backend --url http://localhost:4002
```

Votre backend sera sur: `https://TUNNEL-ID.cfargotunnel.com`

---

## 🔧 Configurer le Frontend pour le Backend

Modifier `clients/web/frontend/src/config.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://TUNNEL-ID.cfargotunnel.com';
```

Ou ajouter dans Cloudflare Pages → Settings → Environment variables:
```
REACT_APP_API_URL=https://TUNNEL-ID.cfargotunnel.com
```

---

## 💰 Coût Total

- Frontend (Cloudflare Pages): **GRATUIT**
- Domaine (.pages.dev): **GRATUIT**
- Backend (Cloudflare Tunnel): **GRATUIT**

**Total: 0€ !**

---

## 🚀 Déploiement Automatique

Chaque fois que vous push sur `main`:

```bash
git add .
git commit -m "Update"
git push origin main
```

→ Cloudflare rebuild automatiquement !

---

## 📊 Après Déploiement

1. **URL Frontend**: `https://aura-osint.pages.dev`
2. **Analytics**: Gratuit dans Cloudflare Dashboard
3. **SSL/HTTPS**: Automatique
4. **CDN**: Mondial (rapide partout)

---

## 🎯 Workflow Complet

```
┌─────────────────────────────────────┐
│  https://aura-osint.pages.dev       │
│  (Frontend - Cloudflare Pages)      │
│  ✅ GRATUIT                          │
└─────────────────────────────────────┘
              ↓
          Appelle
              ↓
┌─────────────────────────────────────┐
│  https://xxx.cfargotunnel.com       │
│  (Cloudflare Tunnel)                │
│  ✅ GRATUIT                          │
└─────────────────────────────────────┘
              ↓
          Tunnel
              ↓
┌─────────────────────────────────────┐
│  localhost:4002                     │
│  (Backend sur votre machine)        │
│  ✅ GRATUIT                          │
└─────────────────────────────────────┘
```

---

## 🆘 Pas de Domaine Custom ?

Pas de problème ! `.pages.dev` fonctionne parfaitement :

- ✅ HTTPS automatique
- ✅ CDN mondial
- ✅ Certificat SSL gratuit
- ✅ Déploiement automatique
- ✅ Illimité

**Vous pouvez toujours acheter un domaine plus tard et le connecter !**

---

## 📚 Prochaines Étapes

1. ✅ Build déjà prêt (fait !)
2. 🚀 Créer projet sur Cloudflare Pages
3. 🔗 Connecter GitHub
4. ⚙️ Configurer build
5. 🎉 Deploy !

**Temps total: 5 minutes**

---

**Pas besoin de domaine, tout est gratuit ! 🎉**
