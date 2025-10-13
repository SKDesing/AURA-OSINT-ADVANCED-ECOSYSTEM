# 🚀 Déploiement Rapide - AURA OSINT

## ✅ Status: Prêt à déployer

Le frontend a été testé et fonctionne parfaitement.

---

## 🎯 Déploiement en 3 étapes

### 1. Build Local (Déjà fait ✅)

```bash
cd clients/web/frontend
npm run build
# ✅ Build réussi: 301.92 kB
```

### 2. Cloudflare Pages Setup

**Dashboard Cloudflare:**
1. Pages → Create project
2. Connect Git → `SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM`
3. Configuration:
   - **Build command**: `cd clients/web/frontend && npm install && npm run build`
   - **Build output**: `clients/web/frontend/build`
   - **Node version**: `18`

### 3. Push & Deploy

```bash
git add .
git commit -m "Deploy AURA OSINT to Cloudflare"
git push origin main
```

✅ Cloudflare build automatiquement !

---

## 🔧 Alternative: CLI Deploy

```bash
# Installer Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
./scripts/deploy/deploy-cloudflare.sh
```

---

## 🌐 URLs

- **Production**: `https://aura-osint-frontend.pages.dev`
- **Backend**: À configurer (voir CLOUDFLARE-DEPLOY-GUIDE.md)

---

## 📚 Documentation Complète

- `CLOUDFLARE-DEPLOY-GUIDE.md` - Guide détaillé
- `CLOUDFLARE-PAGES-SETUP.md` - Configuration originale
- `scripts/deploy/deploy-cloudflare.sh` - Script automatisé

---

## ⚡ Quick Start

```bash
# Option 1: Script automatique
./scripts/deploy/deploy-cloudflare.sh

# Option 2: Manuel
cd clients/web/frontend
npm run build
npx serve -s build -p 8080
```

---

**🎉 Tout est prêt pour Cloudflare Pages !**
