# 🐳 GUIDE DOCKER - SCIS

## 🎯 Containerisation Complète

Votre **Système de Cartographie d'Influence Sociale** est maintenant entièrement containerisé avec Docker pour un déploiement simplifié et une portabilité maximale.

## 📦 Architecture Docker

### **Services Containerisés**
- **🐳 scis-app** - Application principale (Frontend + Backend)
- **🗄️ scis-postgres** - Base de données PostgreSQL 15
- **🔄 scis-redis** - Cache Redis pour les performances
- **🌐 scis-nginx** - Reverse proxy et load balancer

### **Volumes Persistants**
- **postgres_data** - Données de la base PostgreSQL
- **redis_data** - Cache Redis
- **./evidence** - Preuves forensiques (montage host)
- **./logs** - Logs applicatifs (montage host)

## 🚀 Démarrage Rapide

### **Option 1 : Scripts Automatisés**
```bash
# Construction des images
npm run docker:build

# Démarrage complet
npm run docker:start

# Arrêt du système
npm run docker:stop
```

### **Option 2 : Docker Compose Direct**
```bash
# Démarrage
docker-compose -f docker-compose.scis.yml up -d

# Arrêt
docker-compose -f docker-compose.scis.yml down

# Logs en temps réel
docker-compose -f docker-compose.scis.yml logs -f
```

## 🔧 Configuration

### **Variables d'Environnement**
```bash
# Base de données
DB_HOST=postgres
DB_PORT=5432
DB_NAME=live_tracker
DB_USER=postgres
DB_PASSWORD=Mohand/06

# Application
NODE_ENV=production
BACKEND_PORT=4000
FRONTEND_PORT=3000

# Puppeteer (pour Docker)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

### **Ports Exposés**
- **3000** - Frontend React
- **4000** - API Backend
- **5432** - PostgreSQL
- **6379** - Redis
- **80** - Nginx (HTTP)
- **443** - Nginx (HTTPS)

## 🏗️ Structure Docker

```
TikTok Live Analyser/
├── Dockerfile                    # Image principale multi-stage
├── docker-compose.scis.yml       # Orchestration des services
├── nginx.conf                    # Configuration Nginx
├── .dockerignore                 # Fichiers exclus
└── docker-scripts/               # Scripts d'automatisation
    ├── build.sh                  # Construction des images
    ├── start.sh                  # Démarrage du système
    └── stop.sh                   # Arrêt du système
```

## 🐳 Dockerfile Multi-Stage

### **Stage 1 : Base**
- **Node.js 18 Alpine** (image légère)
- **Chromium** pour Puppeteer
- **PostgreSQL client** pour les migrations

### **Stage 2 : Backend Build**
- Installation des dépendances backend
- Optimisation pour la production

### **Stage 3 : Frontend Build**
- Build React optimisé
- Assets statiques minifiés

### **Stage 4 : Production**
- Image finale légère
- Utilisateur non-root pour la sécurité
- Volumes et permissions configurés

## 🌐 Nginx Reverse Proxy

### **Routage Intelligent**
```nginx
/              → Frontend React (port 3000)
/api/          → Backend API (port 4000)
/socket.io/    → WebSocket (port 4000)
/health        → Health check
```

### **Optimisations**
- **Compression Gzip** pour les assets
- **Cache statique** (1 an pour JS/CSS/images)
- **Timeouts** configurés pour les opérations longues
- **Load balancing** prêt pour la scalabilité

## 📊 Monitoring et Logs

### **Logs Centralisés**
```bash
# Tous les services
docker-compose -f docker-compose.scis.yml logs -f

# Service spécifique
docker-compose -f docker-compose.scis.yml logs -f app

# Dernières 100 lignes
docker-compose -f docker-compose.scis.yml logs --tail=100
```

### **Health Checks**
- **PostgreSQL** : `pg_isready`
- **Application** : Dépendance conditionnelle
- **Nginx** : Endpoint `/health`

## 🔒 Sécurité

### **Bonnes Pratiques Intégrées**
- **Utilisateur non-root** dans les conteneurs
- **Secrets** via variables d'environnement
- **Réseau isolé** entre services
- **Volumes** avec permissions restreintes

### **Isolation**
- **Réseau bridge** dédié `scis-network`
- **Conteneurs** isolés du host
- **Données** persistantes dans volumes Docker

## 🚀 Déploiement Production

### **Prérequis**
```bash
# Docker et Docker Compose installés
docker --version
docker-compose --version

# Ports disponibles
sudo netstat -tlnp | grep -E ':(80|443|3000|4000|5432|6379)'
```

### **Déploiement**
```bash
# 1. Cloner le projet
git clone <votre-repo>
cd "TikTok Live Analyser"

# 2. Configuration
cp .env.example .env
# Éditer les variables d'environnement

# 3. Construction et démarrage
npm run docker:build
npm run docker:start

# 4. Vérification
curl http://localhost/health
```

## 🔧 Maintenance

### **Mise à Jour**
```bash
# Reconstruire après modifications
npm run docker:build
npm run docker:restart
```

### **Sauvegarde**
```bash
# Sauvegarde de la base de données
docker exec scis-postgres pg_dump -U postgres live_tracker > backup.sql

# Sauvegarde des volumes
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

### **Restauration**
```bash
# Restaurer la base de données
docker exec -i scis-postgres psql -U postgres live_tracker < backup.sql
```

## 📈 Scalabilité

### **Scaling Horizontal**
```bash
# Plusieurs instances de l'app
docker-compose -f docker-compose.scis.yml up -d --scale app=3
```

### **Optimisations**
- **Redis** pour le cache partagé
- **Nginx** pour le load balancing
- **PostgreSQL** avec pool de connexions
- **Volumes** séparés pour les données

## 🎯 Avantages Docker

### **Développement**
- **Environnement identique** dev/prod
- **Installation simplifiée** en une commande
- **Isolation** des dépendances

### **Production**
- **Déploiement rapide** et fiable
- **Scalabilité** horizontale
- **Monitoring** centralisé
- **Rollback** facile

### **Maintenance**
- **Mises à jour** atomiques
- **Sauvegardes** automatisées
- **Logs** centralisés
- **Health checks** intégrés

**🐳 Votre système SCIS est maintenant prêt pour la production avec Docker !**

---

## 🎮 Commandes Utiles

```bash
# Démarrage rapide
npm run docker:start

# Voir les logs
npm run docker:logs

# Redémarrer un service
docker-compose -f docker-compose.scis.yml restart app

# Shell dans un conteneur
docker exec -it scis-app sh

# Statistiques des conteneurs
docker stats

# Nettoyage
docker system prune -a
```