# 🔬 Intégration Magnet Forensics - SCIS

## 🎯 Vue d'ensemble
Intégration complète des outils Magnet Forensics dans notre plateforme SCIS pour des analyses forensiques de niveau professionnel.

## 🛠️ Outils Magnet Intégrés

### 📊 AXIOM Cyber
- **Fonction** : Analyse approfondie des réseaux sociaux
- **Intégration** : Service Forensic (Port 3008)
- **Endpoint** : `/api/axiom/analyze`
- **Données** : Profils, connexions, timeline, artefacts

### 🤖 Magnet AI
- **Fonction** : Intelligence artificielle forensique
- **Capacités** : Analyse de sentiment, détection de menaces, reconnaissance de patterns
- **Endpoint** : `/api/ai/analyze`
- **Modèles** : Sentiment, Threat-Detection, Pattern-Recognition

### 🌐 OUTRIDER
- **Fonction** : Collecte de données en ligne
- **Portée** : Collecte approfondie sur 30 jours
- **Endpoint** : `/api/outrider/collect`
- **Données** : Profils, posts, connexions, métadonnées

### ⚙️ AUTOMATE
- **Fonction** : Automatisation des workflows forensiques
- **Endpoint** : `/api/automate/workflow`
- **Fonctionnalités** : Triggers, actions, planification

## 🏗️ Architecture d'Intégration

### 🔧 Service Forensic Integration (Port 3008)
```
services/forensic-integration/
├── magnet-connector.js     # Connecteur API Magnet
├── server.js              # Serveur Express
├── package.json           # Dépendances
└── Dockerfile            # Conteneurisation
```

### 🔄 Flux d'Intégration
1. **Collecte** → OUTRIDER récupère les données
2. **Analyse** → AXIOM Cyber analyse les réseaux sociaux
3. **IA** → Magnet AI traite les patterns et menaces
4. **Validation** → Vérification d'intégrité cryptographique
5. **Rapport** → Génération de rapport forensique certifié

## 📡 Endpoints API

### Analyse Sociale
```http
POST /api/axiom/analyze
Content-Type: application/json

{
  "platform": "tiktok",
  "username": "@target",
  "rawData": {...},
  "analysisType": "comprehensive"
}
```

### Intelligence Artificielle
```http
POST /api/ai/analyze
Content-Type: application/json

{
  "evidenceType": "social-media",
  "data": {...},
  "models": ["sentiment", "threat-detection"]
}
```

### Collecte de Données
```http
POST /api/outrider/collect
Content-Type: application/json

{
  "target": "@username",
  "platform": "tiktok",
  "depth": "deep",
  "timeRange": "30d"
}
```

### Validation d'Intégrité
```http
POST /api/validate/evidence
Content-Type: application/json

{
  "hash": "sha256_hash_here",
  "algorithm": "SHA-256"
}
```

## 🔐 Configuration

### Variables d'Environnement
```bash
MAGNET_API_KEY=your_magnet_api_key
MAGNET_API_URL=https://api.magnetforensics.com/v1
FORENSIC_SERVICE_URL=http://forensic-integration:3000
```

### Docker Compose
```yaml
forensic-integration:
  build: ./services/forensic-integration
  ports:
    - "3008:3000"
  environment:
    - MAGNET_API_KEY=${MAGNET_API_KEY}
    - MAGNET_API_URL=${MAGNET_API_URL}
```

## 📊 Intégration avec Services SCIS

### 📋 Reports Service (3007)
- **Endpoint** : `/api/forensic-report`
- **Fonction** : Génération de rapports avec validation Magnet
- **Format** : Compatible standards forensiques

### 👥 Profiles Service (3003)
- **Enrichissement** : Données OUTRIDER automatiques
- **Validation** : Intégrité cryptographique des profils

### 📡 Analyser Service (3002)
- **Temps réel** : Analyse IA en direct
- **Alertes** : Détection de menaces automatique

## 🎯 Avantages de l'Intégration

### 🏆 Niveau Professionnel
- **Certification** : Standards forensiques reconnus
- **Intégrité** : Validation cryptographique des preuves
- **Traçabilité** : Chaîne de custody complète

### ⚡ Performance
- **IA Avancée** : Modèles Magnet pré-entraînés
- **Automatisation** : Workflows intelligents
- **Scalabilité** : Architecture microservices

### 🔒 Sécurité
- **Chiffrement** : Données protégées en transit
- **Audit** : Logs forensiques complets
- **Compliance** : Standards légaux respectés

## 🚀 Déploiement

### Installation
```bash
# Installation des dépendances
cd services/forensic-integration
npm install

# Construction Docker
docker-compose -f docker-compose.enterprise.yml build forensic-integration

# Démarrage
docker-compose -f docker-compose.enterprise.yml up -d
```

### Test de Connectivité
```bash
curl http://localhost:3008/health
```

**Réponse attendue :**
```json
{
  "service": "forensic-integration",
  "status": "healthy",
  "magnet": "connected",
  "timestamp": "2025-01-05T..."
}
```

## 📈 Monitoring

### Métriques Clés
- **Analyses/heure** : Throughput des analyses Magnet
- **Temps de réponse** : Latence API Magnet
- **Taux de succès** : Fiabilité des intégrations
- **Validation** : Intégrité des preuves

### Alertes
- **API Magnet** : Indisponibilité service
- **Quotas** : Limites d'utilisation atteintes
- **Erreurs** : Échecs d'analyse

**🔬 L'intégration Magnet Forensics transforme SCIS en plateforme forensique de niveau enterprise !**