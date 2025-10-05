# 🏗️ ARCHITECTURE MICROSERVICES - SCIS

## 🎯 **Architecture Distribuée Complète**

Votre **Système de Cartographie d'Influence Sociale** est maintenant déployé en **architecture microservices** avec chaque service sur son port dédié.

## 🌐 **Mapping des Services**

### **Gateway Principal (Port 80)**
- **URL** : http://localhost
- **Rôle** : Reverse proxy et routage intelligent
- **Nginx** : Load balancing et SSL termination

### **Services Dédiés**

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| 🎯 **Dashboard** | 3001 | `/` | Page d'accueil et vue d'ensemble |
| 📡 **Analyser** | 3002 | `/analyser` | Analyse temps réel TikTok |
| 👥 **Profiles** | 3003 | `/profiles` | Gestion profils forensiques |
| 🎥 **Lives** | 3004 | `/lives` | Monitoring des lives |
| ➕ **Create** | 3005 | `/create` | Création de profils |
| 🗄️ **Database** | 3006 | `/database` | Explorateur BDD |
| 📋 **Reports** | 3007 | `/reports` | Génération rapports |

### **Infrastructure**
| Service | Port | Description |
|---------|------|-------------|
| 🗄️ **PostgreSQL** | 5432 | Base de données forensique |
| 🔄 **Redis** | 6379 | Cache distribué |
| 🔍 **Consul** | 8500 | Service discovery |

## 🚀 **Déploiement Microservices**

### **Construction des Services**
```bash
# Construire tous les microservices
npm run microservices:build

# Démarrer l'architecture complète
npm run microservices:start

# Surveiller les logs
npm run microservices:logs
```

### **Accès aux Services**

#### **Via Gateway (Recommandé)**
```bash
# Dashboard principal
http://localhost/

# Service Analyser
http://localhost/analyser

# Service Profils
http://localhost/profiles

# Service Lives
http://localhost/lives

# Service Création
http://localhost/create

# Service Database
http://localhost/database

# Service Rapports
http://localhost/reports
```

#### **Accès Direct (Développement)**
```bash
# Dashboard
http://localhost:3001

# Analyser TikTok
http://localhost:3002

# Profils Manager
http://localhost:3003

# Lives Monitor
http://localhost:3004

# Profile Creator
http://localhost:3005

# Database Explorer
http://localhost:3006

# Reports Generator
http://localhost:3007
```

## 🏗️ **Architecture Technique**

### **Nginx Gateway**
```nginx
# Routage intelligent par service
location /analyser { proxy_pass http://analyser-service:3000; }
location /profiles { proxy_pass http://profiles-service:3000; }
location /lives    { proxy_pass http://lives-service:3000; }
location /create   { proxy_pass http://create-service:3000; }
location /database { proxy_pass http://database-service:3000; }
location /reports  { proxy_pass http://reports-service:3000; }
```

### **Service Discovery**
- **Consul** pour la découverte automatique des services
- **Health checks** automatiques
- **Load balancing** intelligent

### **Communication Inter-Services**
- **API REST** pour les appels synchrones
- **Redis** pour le cache partagé
- **PostgreSQL** pour la persistance

## 🔧 **Configuration des Services**

### **Variables d'Environnement**
```bash
# Chaque service
NODE_ENV=production
SERVICE_NAME=<service-name>
DB_HOST=postgres
REDIS_HOST=redis

# Service Analyser (Puppeteer)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### **Volumes Partagés**
```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
  - redis_data:/data
  - ./evidence:/app/evidence  # Preuves forensiques
```

## 📊 **Monitoring et Logs**

### **Logs Centralisés**
```bash
# Tous les services
npm run microservices:logs

# Service spécifique
docker-compose -f docker-compose.microservices.yml logs -f dashboard-service

# Métriques Nginx
curl http://localhost/nginx_status
```

### **Health Checks**
```bash
# Gateway
curl http://localhost/health

# Service spécifique
curl http://localhost:3001/health  # Dashboard
curl http://localhost:3002/health  # Analyser
curl http://localhost:3003/health  # Profiles
```

## 🛡️ **Sécurité Distribuée**

### **Isolation des Services**
- **Réseau Docker** isolé `scis-network`
- **Conteneurs** sans privilèges root
- **Secrets** via variables d'environnement

### **Gateway Security**
- **Rate limiting** par service
- **CORS** configuré par service
- **SSL/TLS** termination au gateway

## 📈 **Scalabilité**

### **Scaling Horizontal**
```bash
# Scaler un service spécifique
docker-compose -f docker-compose.microservices.yml up -d --scale profiles-service=3

# Load balancing automatique via Nginx
```

### **Performance**
- **Cache Redis** partagé entre services
- **Pool de connexions** PostgreSQL
- **Compression Gzip** au gateway
- **Assets** statiques optimisés

## 🎯 **Avantages de l'Architecture**

### **Développement**
- **Services indépendants** - Développement parallèle
- **Technologies spécialisées** - Chaque service optimisé
- **Tests isolés** - Validation par service

### **Déploiement**
- **Déploiement indépendant** - Mise à jour sans downtime
- **Rollback granulaire** - Par service
- **Scaling sélectif** - Selon la charge

### **Maintenance**
- **Isolation des pannes** - Un service n'affecte pas les autres
- **Monitoring granulaire** - Métriques par service
- **Logs structurés** - Traçabilité complète

## 🎮 **Navigation Utilisateur**

### **Dashboard Central**
- **Vue d'ensemble** de tous les services
- **Statistiques** temps réel
- **Liens directs** vers chaque service
- **Monitoring** de santé des services

### **Services Spécialisés**
- **Analyser** : Interface temps réel avec Socket.IO
- **Profiles** : CRUD complet des profils forensiques
- **Lives** : Monitoring des sessions actives
- **Create** : Wizard de création guidée
- **Database** : Explorateur SQL interactif
- **Reports** : Génération de rapports PDF

## 🚀 **Commandes Utiles**

```bash
# Construction complète
npm run microservices:build

# Démarrage
npm run microservices:start

# Logs temps réel
npm run microservices:logs

# Redémarrage
npm run microservices:restart

# Arrêt propre
npm run microservices:stop

# Status des services
docker-compose -f docker-compose.microservices.yml ps

# Scaling d'un service
docker-compose -f docker-compose.microservices.yml up -d --scale analyser-service=2
```

## 🎉 **Résultat Final**

**Architecture Microservices Complète :**
- ✅ **7 services** spécialisés sur ports dédiés
- ✅ **Gateway Nginx** avec routage intelligent
- ✅ **Service Discovery** avec Consul
- ✅ **Cache distribué** Redis
- ✅ **Base forensique** PostgreSQL
- ✅ **Monitoring** et health checks
- ✅ **Scalabilité** horizontale
- ✅ **Isolation** et sécurité

**🏗️ ARCHITECTURE MICROSERVICES OPÉRATIONNELLE !**

---

*Chaque onglet de la navbar ouvre maintenant son service dédié sur son port spécialisé.*