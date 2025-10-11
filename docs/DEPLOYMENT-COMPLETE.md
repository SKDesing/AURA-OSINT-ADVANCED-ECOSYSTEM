# 🚀 DÉPLOIEMENT COMPLET - AURA OSINT ECOSYSTEM

## 🎯 INSTALLATION RAPIDE

### Prérequis Système
- **Docker** 20.10+ avec Docker Compose
- **Node.js** 18+ avec npm/pnpm
- **PostgreSQL** client (psql)
- **Git** pour clonage repository
- **4GB RAM** minimum, 8GB recommandé

### Installation Automatisée
```bash
# Cloner le repository
git clone https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git
cd AURA-OSINT-ADVANCED-ECOSYSTEM

# Installation complète (recommandé)
./database/setup-complete.sh

# Ou installation minimale
./database/setup-complete.sh minimal
```

## 🐳 DÉPLOIEMENT DOCKER

### Services Principaux
```yaml
# docker-compose.unified.yml
services:
  postgres:     # Port 5433 - Base principale
  redis:        # Port 6379 - Cache & sessions  
  elasticsearch: # Port 9200 - Recherche OSINT
  qdrant:       # Port 6333 - Base vectorielle IA
  backend-ai:   # Port 4010 - API NestJS
  frontend:     # Port 3000 - Interface React
```

### Commandes Docker
```bash
# Démarrage complet
docker-compose -f docker-compose.unified.yml up -d

# Vérification santé services
docker-compose ps
docker-compose logs -f backend-ai

# Arrêt propre
docker-compose down --volumes
```

## ⚙️ CONFIGURATION ENVIRONNEMENT

### Variables d'Environnement
```bash
# Base de données
DB_HOST=localhost
DB_PORT=5433
DB_NAME=aura_osint
DB_USER=aura_admin
DB_PASSWORD=AuraOsint2024!

# Redis
REDIS_URL=redis://localhost:6379

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Qdrant
QDRANT_URL=http://localhost:6333

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1h

# AI/Qwen
QWEN_MODEL_PATH=./ai/local-llm/models/
QWEN_API_URL=http://localhost:11434
```

### Configuration Production
```bash
# Optimisations PostgreSQL
shared_buffers=4GB
effective_cache_size=12GB
max_connections=200
work_mem=20MB

# Optimisations Redis  
maxmemory=2gb
maxmemory-policy=allkeys-lru

# Optimisations Elasticsearch
ES_JAVA_OPTS=-Xms2g -Xmx2g
bootstrap.memory_lock=true
```

## 🔧 DÉPLOIEMENT BACKEND

### Backend NestJS (backend-ai/)
```bash
cd backend-ai
npm install
npm run build
npm run start:prod

# Ou avec PM2
pm2 start ecosystem.config.js
```

### Backend Legacy (backend/)
```bash
cd backend
npm install
npm run start

# Health check
curl http://localhost:4010/ai/health
```

## 🖥️ DÉPLOIEMENT FRONTEND

### React App (clients/web-react/)
```bash
cd clients/web-react
npm install
npm run build
npm run start

# Ou serveur statique
npx serve -s build -l 3000
```

### Electron Desktop (apps/browser-electron/)
```bash
cd apps/browser-electron
npm install
npm run electron:build
npm run electron:start
```

## 📊 MONITORING & HEALTH CHECKS

### Endpoints de Santé
```bash
# Backend AI
curl http://localhost:4010/health

# PostgreSQL
psql -h localhost -p 5433 -U aura_admin -d aura_osint -c "SELECT 1"

# Redis
redis-cli -p 6379 ping

# Elasticsearch
curl http://localhost:9200/_cluster/health

# Qdrant
curl http://localhost:6333/healthz
```

### Métriques Système
```bash
# Utilisation ressources
docker stats

# Logs en temps réel
docker-compose logs -f --tail=100

# Espace disque
df -h
du -sh /var/lib/docker/volumes/
```

## 🔄 CI/CD & AUTOMATISATION

### GitHub Actions
- **Tests automatisés** sur PR
- **Build & Deploy** sur main
- **Security scanning** quotidien
- **Dependency updates** automatiques

### Scripts Utilitaires
```bash
# Backup base de données
./scripts/backup-database.sh

# Mise à jour système
./scripts/update-system.sh

# Nettoyage logs
./scripts/cleanup-logs.sh

# Test complet
./scripts/run-tests.sh
```

## 🚨 TROUBLESHOOTING

### Problèmes Courants
```bash
# Port déjà utilisé
sudo lsof -i :5433
sudo kill -9 <PID>

# Permissions Docker
sudo usermod -aG docker $USER
newgrp docker

# Espace disque insuffisant
docker system prune -a --volumes

# Reset complet
docker-compose down --volumes --rmi all
./database/setup-complete.sh
```

### Logs de Debug
```bash
# Backend logs
tail -f backend-ai/logs/app.log

# PostgreSQL logs
docker logs aura-postgres

# Elasticsearch logs
docker logs aura-elasticsearch

# System logs
journalctl -u docker -f
```

## 📋 CHECKLIST DÉPLOIEMENT

### Pré-déploiement
- [ ] Prérequis système installés
- [ ] Variables d'environnement configurées
- [ ] Certificats SSL générés
- [ ] Firewall configuré
- [ ] Backup strategy définie

### Post-déploiement
- [ ] Health checks passent
- [ ] Monitoring configuré
- [ ] Logs fonctionnels
- [ ] Performance acceptable
- [ ] Sécurité validée
- [ ] Documentation à jour

### Production Ready
- [ ] Load balancer configuré
- [ ] Auto-scaling activé
- [ ] Monitoring alertes
- [ ] Backup automatique
- [ ] Disaster recovery testé
- [ ] Security hardening appliqué