# 🔍 OUTILS OSINT COMPLETS - AURA OSINT ECOSYSTEM

## 🎯 OUTILS PRINCIPAUX INTÉGRÉS

### 1. SHERLOCK - Recherche Comptes Utilisateur
```bash
# Usage
sherlock username --timeout 10 --print-found

# Output JSON
{
  "username": "target_user",
  "results": [
    {
      "platform": "GitHub",
      "url": "https://github.com/target_user",
      "status": "found",
      "response_time": 0.342
    }
  ],
  "total_found": 42
}
```

### 2. HOLEHE - OSINT Email Avancé
```bash
# Usage
holehe target@example.com --only-used

# Output JSON
{
  "email": "target@example.com",
  "services": [
    {
      "name": "spotify",
      "exists": true,
      "method": "register"
    }
  ],
  "found": 28
}
```

### 3. SUBLIST3R - Énumération Sous-domaines
```bash
# Usage
sublist3r -d example.com -t 100 -o results.txt

# Output
mail.example.com
api.example.com
admin.example.com
```

### 4. THEHARVESTER - Intelligence Email/Domaine
```bash
# Usage
theHarvester -d example.com -l 500 -b google,bing,linkedin

# Output
emails: admin@example.com, contact@example.com
hosts: mail.example.com, ftp.example.com
```

### 5. SUBFINDER - Découverte Sous-domaines Rapide
```bash
# Usage
subfinder -d example.com -silent -o subdomains.txt

# Output JSON
{
  "host": "example.com",
  "subdomains": [
    {
      "subdomain": "mail.example.com",
      "ip": "192.168.1.10",
      "source": "crtsh"
    }
  ]
}
```

## 🌐 PLATEFORMES SOCIALES

### TikTok Analyzer
```javascript
// Analyse profil TikTok
{
  "username": "@charlidamelio",
  "profile": {
    "followers": 155800000,
    "verified": true,
    "bio": "booking: charli@unitedtalent.com"
  },
  "videos": [
    {
      "video_id": "7180512345678901234",
      "stats": {
        "views": 45000000,
        "likes": 8900000
      },
      "hashtags": ["#fyp", "#dance"]
    }
  ]
}
```

### Instagram Monitor
```javascript
// Surveillance Instagram
{
  "username": "target_user",
  "profile": {
    "followers": 1250,
    "following": 890,
    "posts": 156,
    "is_private": false
  },
  "recent_posts": [
    {
      "post_id": "ABC123",
      "timestamp": "2024-01-15T10:30:00Z",
      "likes": 45,
      "comments": 12,
      "location": "Paris, France"
    }
  ]
}
```

### Facebook Intel
```javascript
// Intelligence Facebook
{
  "profile_id": "100001234567890",
  "name": "John Doe",
  "location": "New York, NY",
  "work": "Software Engineer at Tech Corp",
  "education": "MIT Computer Science",
  "friends_count": 456,
  "photos": [
    {
      "photo_id": "123456789",
      "upload_date": "2024-01-10",
      "location_tagged": "Central Park"
    }
  ]
}
```

## 📱 OUTILS TÉLÉPHONIQUES

### PhoneInfoga
```bash
# Usage
phoneinfoga scan -n "+33123456789"

# Output JSON
{
  "number": "+33123456789",
  "country": "France",
  "carrier": "Orange",
  "line_type": "mobile",
  "is_valid": true,
  "social_media": [
    {
      "platform": "whatsapp",
      "registered": true
    }
  ]
}
```

## 🌍 OUTILS RÉSEAU & DOMAINES

### Amass - Reconnaissance Complète
```bash
# Usage
amass enum -d example.com -config config.ini

# Output
mail.example.com [192.168.1.10]
api.example.com [192.168.1.20]
admin.example.com [192.168.1.30]
```

### Nmap - Scan Ports
```bash
# Usage
nmap -sS -O -A target.com

# Output
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.0
80/tcp   open  http    nginx 1.18.0
443/tcp  open  https   nginx 1.18.0
```

## 🔍 MOTEURS DE RECHERCHE

### SearXNG - Recherche OSINT
```bash
# API Usage
curl "http://localhost:8080/search?q=target+user&format=json"

# Output JSON
{
  "query": "target user",
  "results": [
    {
      "title": "Target User Profile",
      "url": "https://example.com/profile",
      "content": "Profile information...",
      "engine": "google"
    }
  ]
}
```

### Google Dorks Intégrés
```bash
# Recherches automatisées
site:linkedin.com "John Doe" "Software Engineer"
filetype:pdf "confidential" site:example.com
inurl:admin site:example.com
```

## 🤖 INTELLIGENCE ARTIFICIELLE

### Qwen AI Orchestrator
```javascript
// Analyse intelligente
{
  "query": "Analyser le profil @username sur TikTok",
  "ai_response": {
    "intent": "social_media_analysis",
    "platform": "tiktok",
    "target": "@username",
    "recommended_tools": ["tiktok_analyzer", "sherlock"],
    "investigation_plan": [
      "Récupérer profil TikTok",
      "Analyser contenu vidéos",
      "Rechercher comptes liés",
      "Générer rapport"
    ]
  }
}
```

### NLP Analyzer
```python
# Analyse de contenu
{
  "text": "Contenu à analyser",
  "analysis": {
    "sentiment": "neutral",
    "entities": [
      {"text": "Paris", "type": "LOCATION"},
      {"text": "John", "type": "PERSON"}
    ],
    "keywords": ["investigation", "osint", "analysis"],
    "language": "fr",
    "confidence": 0.95
  }
}
```

## 📊 FORMATS DE SORTIE STANDARDISÉS

### Format Unifié OSINT
```json
{
  "investigation_id": "uuid",
  "target": {
    "type": "username",
    "identifier": "target_user"
  },
  "tool": "sherlock",
  "timestamp": "2024-01-15T10:30:00Z",
  "results": {
    "found_accounts": 15,
    "platforms": ["github", "twitter", "instagram"],
    "confidence_score": 0.85
  },
  "metadata": {
    "execution_time": 45.2,
    "proxy_used": "192.168.1.100",
    "user_agent": "Mozilla/5.0..."
  }
}
```

## 🔧 CONFIGURATION OUTILS

### Fichier de Configuration Global
```yaml
# osint-tools.yml
tools:
  sherlock:
    timeout: 10
    max_workers: 20
    proxy_rotation: true
    
  holehe:
    rate_limit: 5
    verify_ssl: false
    
  subfinder:
    sources: ["crtsh", "virustotal", "shodan"]
    max_results: 1000
    
  amass:
    brute_force: true
    wordlist: "subdomains.txt"
    dns_resolvers: ["8.8.8.8", "1.1.1.1"]
```

## 📈 MÉTRIQUES & PERFORMANCE

### Statistiques d'Utilisation
- **Sherlock**: 500+ plateformes supportées
- **Holehe**: 120+ services email
- **Subfinder**: 35+ sources de données
- **TheHarvester**: 25+ moteurs de recherche
- **Amass**: Reconnaissance passive/active
- **PhoneInfoga**: Validation internationale

### Performance Optimisée
- **Exécution parallèle** multi-thread
- **Rotation proxy** automatique
- **Cache intelligent** résultats
- **Rate limiting** respectueux
- **Retry logic** robuste