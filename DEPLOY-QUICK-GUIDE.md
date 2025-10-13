# 🚀 AURA OSINT - Quick Deployment Guide

## Prerequisites
- Node.js 18+
- Cloudflare account (free)
- GitHub repo access

---

## 🎨 FRONTEND (Cloudflare Pages)

### Step 1: Configure Cloudflare Pages
1. Go to https://dash.cloudflare.com
2. Pages → Create project → Connect to Git
3. Select: `SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM`
4. Configure:
   ```
   Framework: Create React App
   Build command: cd clients/web/frontend && npm install && npm run build
   Build output: clients/web/frontend/build
   Root: (empty)
   ```
5. Environment variables:
   ```
   NODE_VERSION=18
   ```
6. Deploy

**Result:** `https://aura-osint-advanced-ecosystem.pages.dev`

---

## ⚙️ BACKEND (Cloudflare Tunnel)

### Step 1: Install Cloudflared
```bash
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

### Step 2: Authenticate
```bash
cloudflared tunnel login
```

### Step 3: Create Tunnel
```bash
cloudflared tunnel create aura-backend
```

### Step 4: Configure
```bash
TUNNEL_UUID=$(cloudflared tunnel list | grep aura-backend | awk '{print $1}')

cat > ~/.cloudflared/config.yml <<EOF
tunnel: $TUNNEL_UUID
credentials-file: /home/$USER/.cloudflared/${TUNNEL_UUID}.json

ingress:
  - service: http://localhost:4010
EOF
```

### Step 5: Start Backend + Tunnel
```bash
# Terminal 1: Backend
cd ~/AURA-OSINT-ADVANCED-ECOSYSTEM/backend
npm install
node server.js

# Terminal 2: Tunnel
cloudflared tunnel run aura-backend
```

**Result:** Copy the tunnel URL (e.g., `https://aura-backend-abc123.trycloudflare.com`)

---

## 🔗 CONNECT FRONTEND TO BACKEND

1. Go to Cloudflare Pages → Settings → Environment variables
2. Add:
   ```
   REACT_APP_API_URL=https://your-tunnel-url.trycloudflare.com
   REACT_APP_WS_URL=wss://your-tunnel-url.trycloudflare.com
   ```
3. Deployments → Retry deployment

---

## ✅ VERIFY

```bash
# Test backend
curl https://your-tunnel-url.triploudflare.com/health

# Test frontend
open https://aura-osint-advanced-ecosystem.pages.dev
```

---

## 🔄 MAKE TUNNEL PERSISTENT

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## 📋 CHECKLIST

- [ ] Frontend deployed on Cloudflare Pages
- [ ] Backend running locally (port 4010)
- [ ] Tunnel active and public
- [ ] Environment variables configured
- [ ] Frontend connects to backend
- [ ] No console errors

---

## 🆘 TROUBLESHOOTING

**Build fails:** Check Node version (must be 18)
**Tunnel fails:** Verify backend is running on port 4010
**CORS errors:** Add frontend URL to backend CORS config
**Connection fails:** Check environment variables in Cloudflare Pages

---

## 📞 SUPPORT

Create GitHub issue with:
- Error message
- Screenshots
- Steps to reproduce
