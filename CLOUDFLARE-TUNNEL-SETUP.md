# 🔒 Cloudflare Tunnel - Backend AURA OSINT (GRATUIT)

## 🎯 Objectif

Exposer votre backend local sur Internet via `api.auraosintecosystem.io` **SANS serveur externe**.

---

## ✅ Avantages

- ✅ **Gratuit** (pas de VPS à payer)
- ✅ **Sécurisé** (tunnel chiffré)
- ✅ **Simple** (votre machine reste chez vous)
- ✅ **HTTPS automatique**

---

## 📋 Installation (Une seule fois)

### 1. Télécharger cloudflared

```bash
cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM

# Télécharger
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Installer
sudo dpkg -i cloudflared-linux-amd64.deb

# Vérifier
cloudflared --version
```

### 2. Authentifier avec Cloudflare

```bash
cloudflared tunnel login
```

→ Une page web s'ouvre
→ Sélectionner `auraosintecosystem.io`
→ Autoriser

### 3. Créer le tunnel

```bash
cloudflared tunnel create aura-backend
```

→ Note le **Tunnel ID** (vous en aurez besoin)

### 4. Configurer le DNS

```bash
cloudflared tunnel route dns aura-backend api.auraosintecosystem.io
```

✅ Maintenant `api.auraosintecosystem.io` pointe vers votre tunnel

---

## 🚀 Utilisation Quotidienne

### Démarrer AURA avec Tunnel

```bash
cd /home/soufiane/AURA-OSINT-ADVANCED-ECOSYSTEM

# Terminal 1: Lancer le backend
npm start

# Terminal 2: Lancer le tunnel
cloudflared tunnel run aura-backend --url http://localhost:4002
```

✅ Votre backend est maintenant accessible sur `https://api.auraosintecosystem.io`

---

## 🔧 Configuration Automatique (Optionnel)

Créer un fichier de config pour ne pas taper la commande à chaque fois :

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Contenu :
```yaml
tunnel: aura-backend
credentials-file: /home/soufiane/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.auraosintecosystem.io
    service: http://localhost:4002
  - service: http_status:404
```

Remplacer `<TUNNEL_ID>` par votre ID de tunnel.

Puis simplement :
```bash
cloudflared tunnel run aura-backend
```

---

## 🎯 Architecture Finale

```
┌─────────────────────────────────────────────┐
│  auraosintecosystem.io                      │
│  (Frontend - Cloudflare Pages)              │
│  ✅ Hébergé par Cloudflare (gratuit)        │
└─────────────────────────────────────────────┘
                    ↓
                 Appelle
                    ↓
┌─────────────────────────────────────────────┐
│  api.auraosintecosystem.io                  │
│  (Cloudflare Tunnel)                        │
│  ✅ Tunnel sécurisé (gratuit)               │
└─────────────────────────────────────────────┘
                    ↓
                 Tunnel
                    ↓
┌─────────────────────────────────────────────┐
│  localhost:4002                             │
│  (Backend AURA sur VOTRE machine)           │
│  ✅ Tourne chez vous                        │
└─────────────────────────────────────────────┘
```

---

## 🔒 Sécurité

Le tunnel Cloudflare :
- ✅ Chiffré de bout en bout
- ✅ Pas besoin d'ouvrir de ports sur votre routeur
- ✅ Protection DDoS automatique
- ✅ HTTPS automatique

---

## 📊 Tester

```bash
# Lancer backend
npm start

# Lancer tunnel (autre terminal)
cloudflared tunnel run aura-backend --url http://localhost:4002

# Tester
curl https://api.auraosintecosystem.io/api/status
```

---

## 🆘 Troubleshooting

### Tunnel ne démarre pas
```bash
# Vérifier que le backend tourne
curl http://localhost:4002/api/status

# Relancer le tunnel
cloudflared tunnel run aura-backend --url http://localhost:4002
```

### DNS pas propagé
Attendre 5-10 minutes après `cloudflare tunnel route dns`

---

## 💰 Coût Total

- Frontend (Cloudflare Pages): **GRATUIT**
- Backend (Cloudflare Tunnel): **GRATUIT**
- Domaine (auraosintecosystem.io): ~10€/an

**Total: ~10€/an (juste le domaine) !**

---

## 🚀 Prochaines Étapes

1. ✅ Changer les nameservers (en cours)
2. ⏳ Attendre propagation (2-24h)
3. 🚀 Déployer frontend sur Cloudflare Pages
4. 🔒 Installer Cloudflare Tunnel
5. ✅ Site live !

---

**Pas besoin de VPS, tout est gratuit avec Cloudflare ! 🎉**
