# 🚀 Guide de Déploiement AURA

## Déploiement Local (Développement)

### 1. Prérequis
```bash
# Vérifier les installations
docker --version          # v28.5.0+
docker-compose --version  # v1.29.2+
node --version            # v22.20.0+
npm --version             # v10.9.3+
```

### 2. Démarrage Rapide
```bash
# Cloner le projet
git clone <repository-url>
cd "TikTok Live Analyser"

# Démarrer l'infrastructure
docker-compose up -d

# Initialiser la base de données
docker exec -i aura_db psql -U aura_user -d aura_investigations < init-db.sql

# Installer les dépendances
cd backend && npm install
cd ../capture-script && npm install && npx playwright install chromium
cd ../frontend && npm install
```

### 3. Lancer l'Application
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Première capture
cd capture-script
node capture.js "https://www.tiktok.com/@username/live" "Test Investigation"
```

## Déploiement Production

### Option 1: VPS/Serveur Dédié

#### Configuration Serveur
```bash
# Ubuntu 22.04 LTS recommandé
# Minimum: 4GB RAM, 2 CPU, 50GB SSD

# Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Déploiement
```bash
# Cloner sur le serveur
git clone <repository-url> /opt/aura
cd /opt/aura

# Configuration production
cp docker-compose.yml docker-compose.prod.yml
# Modifier les ports et variables d'environnement

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d

# Configuration Nginx (reverse proxy)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/aura
```

#### Configuration Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Cloud (AWS/GCP/Azure)

#### AWS EC2 + RDS + S3
```bash
# Instance EC2: t3.medium (2 vCPU, 4GB RAM)
# RDS PostgreSQL: db.t3.micro
# S3 Bucket pour les vidéos
# CloudFront pour la distribution

# Variables d'environnement production
export DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/aura"
export S3_BUCKET="aura-videos-prod"
export AWS_REGION="eu-west-1"
```

#### Docker Compose Production
```yaml
version: '3.8'
services:
  aura_backend:
    image: aura-backend:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - S3_BUCKET=${S3_BUCKET}
    ports:
      - "3000:3000"
    restart: unless-stopped

  aura_frontend:
    image: aura-frontend:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

## Monitoring et Maintenance

### Logs
```bash
# Voir les logs des services
docker-compose logs -f aura_backend
docker-compose logs -f aura_db

# Logs de capture
tail -f capture-script/logs/capture.log
```

### Sauvegarde
```bash
# Sauvegarde base de données
docker exec aura_db pg_dump -U aura_user aura_investigations > backup_$(date +%Y%m%d).sql

# Sauvegarde vidéos (si local)
tar -czf videos_backup_$(date +%Y%m%d).tar.gz /path/to/videos
```

### Mise à jour
```bash
# Arrêter les services
docker-compose down

# Mettre à jour le code
git pull origin main

# Reconstruire les images
docker-compose build

# Redémarrer
docker-compose up -d
```

## Sécurité

### Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### SSL/TLS (Let's Encrypt)
```bash
# Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### Variables d'Environnement Sécurisées
```bash
# Créer .env.production
DATABASE_PASSWORD=mot_de_passe_fort_aleatoire
MINIO_SECRET_KEY=cle_secrete_minio_forte
JWT_SECRET=jwt_secret_tres_long_et_aleatoire
```

## Troubleshooting

### Problèmes Courants
```bash
# Port déjà utilisé
sudo lsof -i :5432
sudo kill -9 <PID>

# Permissions Docker
sudo chmod 666 /var/run/docker.sock

# Espace disque
df -h
docker system prune -a

# Logs d'erreur
docker-compose logs --tail=50 aura_backend
```

### Performance
```bash
# Monitoring ressources
htop
docker stats

# Optimisation PostgreSQL
# Augmenter shared_buffers, work_mem dans postgresql.conf
```

## Support

- 📧 Email: support@aura-project.com
- 📚 Documentation: [Wiki du projet]
- 🐛 Issues: [GitHub Issues]
- 💬 Discord: [Serveur communauté]