# 🌐 Configuration Nameservers Cloudflare - auraosintecosystem.io

## ✅ Domaine: auraosintecosystem.io

### 📋 Nameservers Cloudflare assignés:
```
liz.ns.cloudflare.com
ryan.ns.cloudflare.com
```

---

## 🔧 Étapes de Configuration

### 1. Identifier votre registrar (bureau d'enregistrement)

Vérifier où vous avez acheté le domaine :
- [Recherche ICANN](https://lookup.icann.org/en/lookup)
- Exemples: GoDaddy, Namecheap, OVH, Gandi, etc.

### 2. Se connecter au registrar

Connectez-vous au compte où vous avez acheté `auraosintecosystem.io`

### 3. Désactiver DNSSEC (Important !)

⚠️ **Avant de changer les nameservers** :
- Chercher "DNSSEC" dans les paramètres DNS
- Si activé → **Désactiver**
- Vous pourrez le réactiver après via Cloudflare

### 4. Changer les Nameservers

**Trouver la section "Nameservers" ou "DNS Management"**

**Remplacer les nameservers actuels par :**
```
liz.ns.cloudflare.com
ryan.ns.cloudflare.com
```

**Supprimer tous les autres nameservers**

### 5. Sauvegarder

Cliquer sur "Save" ou "Update"

---

## ⏱️ Délai de Propagation

- **Temps moyen**: 2-4 heures
- **Maximum**: 24 heures
- Cloudflare vous enverra un email quand c'est actif

---

## 🧪 Vérifier la Propagation

```bash
# Vérifier les nameservers actuels
dig NS auraosintecosystem.io +short

# Ou
nslookup -type=NS auraosintecosystem.io
```

Quand vous verrez `liz.ns.cloudflare.com` et `ryan.ns.cloudflare.com`, c'est actif !

---

## 📊 Après Activation

Une fois les nameservers propagés, vous pourrez :

### 1. Déployer le Frontend sur Cloudflare Pages
```
Dashboard → Pages → Create project
Repository: SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM
Build: cd clients/web/frontend && npm install && npm run build
Output: clients/web/frontend/build
```

### 2. Configurer le Domaine Custom
```
Pages → aura-osint-frontend → Custom domains
Ajouter: auraosintecosystem.io
```

### 3. Configurer les Sous-domaines
```
www.auraosintecosystem.io → Frontend
api.auraosintecosystem.io → Backend (via Tunnel)
```

---

## 🔒 Cloudflare Tunnel pour le Backend

Une fois les nameservers actifs :

```bash
# Installer cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authentifier
cloudflared tunnel login

# Créer tunnel
cloudflared tunnel create aura-backend

# Router le tunnel
cloudflared tunnel route dns aura-backend api.auraosintecosystem.io

# Lancer le backend
npm start &

# Lancer le tunnel
cloudflared tunnel run aura-backend --url http://localhost:4002
```

---

## 🎯 Architecture Finale

```
auraosintecosystem.io              → Frontend (Cloudflare Pages)
www.auraosintecosystem.io          → Frontend (Cloudflare Pages)
api.auraosintecosystem.io          → Backend (Cloudflare Tunnel)
```

---

## 📋 Checklist

- [ ] Identifier le registrar du domaine
- [ ] Se connecter au compte registrar
- [ ] Désactiver DNSSEC
- [ ] Remplacer nameservers par Cloudflare
- [ ] Sauvegarder les modifications
- [ ] Attendre propagation (2-24h)
- [ ] Vérifier avec `dig NS auraosintecosystem.io`
- [ ] Configurer Cloudflare Pages
- [ ] Configurer Cloudflare Tunnel
- [ ] Tester le site

---

## 🆘 Registrars Courants

### GoDaddy
1. My Products → Domains
2. Cliquer sur le domaine
3. DNS Management → Nameservers → Change
4. Custom → Ajouter les nameservers Cloudflare

### Namecheap
1. Domain List → Manage
2. Nameservers → Custom DNS
3. Ajouter les nameservers Cloudflare

### OVH
1. Domaines → Nom de domaine
2. Serveurs DNS → Modifier les serveurs DNS
3. Ajouter les nameservers Cloudflare

### Gandi
1. Domaines → Gérer
2. Serveurs de noms → Modifier
3. Ajouter les nameservers Cloudflare

---

**⏳ Après avoir changé les nameservers, attendez l'email de Cloudflare puis suivez DEPLOY-NOW.md**
