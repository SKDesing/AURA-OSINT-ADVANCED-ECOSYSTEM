# AURA OSINT - Documentation Complète

> Écosystème d'investigation OSINT avancé avec IA intégrée
> Version: 1.0.0

## 🎯 Présentation

AURA OSINT est un écosystème complet d'investigation en sources ouvertes (OSINT) avec une interface IA avancée basée sur Qwen.

### Architecture
```
AURA-OSINT-ADVANCED-ECOSYSTEM/
├── ai-engine/              # Moteur IA avec Qwen
├── backend/               # API REST et WebSocket  
├── aura-browser/          # Interface Electron
├── tools/                 # Scripts d'outils OSINT
└── optimized/             # Fichiers optimisés
```

## 🚀 Installation Rapide

```bash
# Lancer avec le script optimisé
./RUN-AURA-OPTIMIZED.sh
```

## 🛠️ Outils OSINT (17 outils)

### 📱 Phone (2): phoneinfoga, phonenumbers
### 🧅 Darknet (2): onionscan, torbot  
### 👤 Username (2): sherlock, maigret
### 🌐 Network (5): shodan, ip_intelligence, port_scanner, ssl_analyzer, network_mapper
### 📧 Email (1): holehe
### 💥 Breach (1): h8mail
### 🌍 Domain (2): subfinder, whois
### 📱 Social (2): twitter, instagram

## 🔌 API Endpoints

- `GET /api/osint/tools` - Lister tous les outils
- `POST /api/osint/investigate` - Lancer une investigation
- `GET /api/osint/results/:id` - Obtenir les résultats
- `POST /api/chat` - Chat avec l'IA

## 🎯 Utilisation

### Chat IA
- "Analyse l'email john.doe@example.com"
- "Recherche le pseudonyme @johndoe"
- "Scan les ports de 192.168.1.1"

### WebSocket
Connectez-vous à `ws://localhost:4011` pour les notifications temps réel.

## ⚙️ Configuration

Voir `optimized/config/aura-config.json` pour la configuration complète.

## 🐛 Dépannage

```bash
# Tuer les processus utilisant le port
lsof -ti:4011 | xargs kill -9

# Vérifier Docker
docker-compose ps
```

---
*AURA OSINT - Advanced OSINT Investigation Platform*
