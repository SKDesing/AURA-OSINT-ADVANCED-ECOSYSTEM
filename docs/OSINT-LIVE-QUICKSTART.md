# 🚀 OSINT Live Quickstart

## Interface OSINT Vivante - Guide Express

### ✅ Status
- **Sherlock**: ✅ Connecté (`/home/soufiane/.local/bin/sherlock`)
- **Amass**: ✅ Connecté (`/snap/bin/amass`)
- **Frontend**: ✅ Port 3001/3002 
- **Backend**: ✅ Port 4010

### 🎯 Endpoints Live
- `POST /api/osint/live/sherlock` - Username investigation
- `POST /api/osint/live/amass` - Domain enumeration
- `POST /api/osint/live/maigret` - Alias vers Sherlock

### 🚀 Démarrage Rapide

```bash
# Backend
cd backend && node mvp-server-fixed.js

# Frontend (autre terminal)
cd clients/web-react && npm start
```

### 🧪 Tests API

```bash
# Test Sherlock
curl -X POST http://127.0.0.1:4010/api/osint/live/sherlock \
  -H 'Content-Type: application/json' \
  -d '{"username":"elonmusk"}'

# Test Amass
curl -X POST http://127.0.0.1:4010/api/osint/live/amass \
  -H 'Content-Type: application/json' \
  -d '{"domain":"example.com","passive":true}'
```

### 🌐 Interface Web
1. Ouvrir http://127.0.0.1:3001 ou 3002
2. Aller dans **OSINT Tools**
3. Sélectionner **Sherlock** ou **Amass**
4. Entrer username/domain
5. Cliquer **Run Tool**
6. Voir les résultats en temps réel

### 🔧 Configuration
- **Base URL**: `REACT_APP_API_BASE_URL=http://127.0.0.1:4010`
- **Timeout**: Sherlock 60s, Amass 120s
- **Résultats**: Max 200 par requête

### 🚨 Troubleshooting
- **Sherlock not found**: `pip install sherlock-project`
- **Amass not found**: `sudo snap install amass`
- **CORS errors**: Backend CORS déjà configuré
- **Empty results**: Vérifier logs backend

### 📊 Formats de Réponse

**Sherlock Response:**
```json
{
  "tool": "sherlock",
  "username": "elonmusk",
  "results": [
    {
      "site": "Twitter",
      "url": "https://twitter.com/elonmusk",
      "status": "found",
      "response_time": 0.5
    }
  ]
}
```

**Amass Response:**
```json
{
  "tool": "amass",
  "domain": "example.com",
  "passive": true,
  "count": 5,
  "results": [
    {
      "subdomain": "www.example.com",
      "type": "subdomain",
      "source": "amass"
    }
  ]
}
```

**Interface OSINT maintenant VIVANTE ! 🎯**