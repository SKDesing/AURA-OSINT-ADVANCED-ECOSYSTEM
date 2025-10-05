# 🏗️ Architecture Microservices Optimisée - SCIS

## 🎯 Vue d'ensemble
Architecture distribuée avec spécialisation par service pour optimiser les performances et la scalabilité.

## 📊 Services Actifs

### 🖥️ Frontend & Interface
- **Frontend React** (Port 3000) - Interface utilisateur principale
- **Dashboard Service** (Port 3001) - Hub central de navigation

### 🔧 Services Métier
- **Analyser Service** (Port 3002) - Analyse TikTok temps réel + Socket.IO
- **Profiles Service** (Port 3003) - Gestion profils forensiques + CRUD
- **Lives Service** (Port 3004) - Monitoring lives actifs + WebRTC
- **Create Service** (Port 3005) - Wizard création profils + Validation
- **Database Service** (Port 3006) - Explorateur SQL + Requêtes
- **Reports Service** (Port 3007) - Génération rapports + PDF

### 🗄️ Infrastructure
- **PostgreSQL** (Port 5433) - Base données forensique
- **Redis** (Port 6379) - Cache et sessions
- **Consul** (Port 8500) - Service discovery
- **Nginx Gateway** (Port 8080) - Load balancer

## ⚡ Optimisations par Service

### 📡 Analyser Service (3002)
- **Spécialisation** : Puppeteer + Socket.IO
- **Ressources** : CPU intensif, mémoire élevée
- **Scaling** : Horizontal pour multiple lives

### 👥 Profiles Service (3003)
- **Spécialisation** : CRUD + Validation Joi
- **Ressources** : I/O base de données
- **Cache** : Redis pour profils fréquents

### 🎥 Lives Service (3004)
- **Spécialisation** : WebRTC + Streaming
- **Ressources** : Bande passante élevée
- **Temps réel** : WebSocket connections

### 🗄️ Database Service (3006)
- **Spécialisation** : Requêtes SQL complexes
- **Ressources** : Connexions DB optimisées
- **Sécurité** : Requêtes sanitisées

### 📋 Reports Service (3007)
- **Spécialisation** : Génération PDF + Templates
- **Ressources** : CPU pour rendering
- **Storage** : Fichiers temporaires

## 🔄 Communication Inter-Services
- **API REST** : Communication synchrone
- **Redis Pub/Sub** : Messages asynchrones
- **Consul** : Service discovery
- **Nginx** : Load balancing et routing

## 📈 Avantages Architecture
1. **Scalabilité** : Chaque service scale indépendamment
2. **Performance** : Ressources optimisées par besoin
3. **Maintenance** : Déploiements indépendants
4. **Résilience** : Isolation des pannes
5. **Spécialisation** : Technologies adaptées par service