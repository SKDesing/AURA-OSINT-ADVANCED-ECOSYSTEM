# AURA - Audiovisual User-Generated content Recorder & Analyzer

Outil d'enquête journalistique pour capturer et analyser les contenus haineux sur TikTok Live.

## Installation Rapide

```bash
# 1. Cloner et installer
cd "TikTok Live Analyser"

# 2. Démarrer l'infrastructure
docker-compose up -d

# 3. Initialiser la base de données
docker exec -i aura_db psql -U aura_user -d aura_investigations < init-db.sql

# 4. Installer le script de capture
cd capture-script
npm install
npx playwright install chromium

# 5. Installer le backend
cd ../backend
npm install
```

## Utilisation

### 1. Démarrer une capture
```bash
cd capture-script
node capture.js "https://www.tiktok.com/@username/live" "Enquête Haine Live"
```

### 2. Accéder aux interfaces
- Backend API: http://localhost:3000
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
- PostgreSQL: localhost:5432

### 3. Arrêter une capture
Appuyez sur `Ctrl+C` dans le terminal du script de capture.

## Architecture

- **capture-script/**: Script Playwright pour capturer vidéo + commentaires
- **backend/**: API Node.js + Socket.IO pour traitement temps réel
- **PostgreSQL**: Stockage des métadonnées et commentaires
- **MinIO**: Stockage des fichiers vidéo
- **Redis**: Cache et file d'attente

## Prochaines Étapes

1. Développer le frontend React
2. Intégrer l'IA de détection de haine
3. Ajouter l'export de preuves
4. Optimiser pour Wayland/Xorg