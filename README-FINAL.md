# 🎯 TikTok Live Analyser - Solution Forensique Professionnelle

## 📋 Vue d'ensemble

**TikTok Live Analyser** est une solution forensique complète pour l'analyse en temps réel des lives TikTok. Conçue pour les professionnels de la sécurité, enquêteurs et analystes, cette plateforme offre des capacités d'extraction, d'analyse et de documentation avec intégrité cryptographique.

## ✨ Fonctionnalités Principales

### 🔍 Analyse Forensique des Profils
- **Extraction complète** des données de profil TikTok
- **Screenshots automatiques** avec horodatage
- **Intégrité cryptographique** (hachage SHA-256)
- **Métadonnées techniques** (cookies, localStorage, etc.)
- **Historique des modifications** avec traçabilité

### 📡 Capture Live en Temps Réel
- **Interception WebSocket** des données live
- **Commentaires et cadeaux** en temps réel
- **Statistiques d'audience** automatiques
- **Preuves horodatées** avec hash d'intégrité
- **Interface de monitoring** en direct

### 🗄️ Base de Données Forensique
- **PostgreSQL** avec schéma optimisé
- **Explorateur de données** intégré
- **Requêtes SQL** personnalisées
- **Export de rapports** automatisé
- **Audit trail** complet

### 🎨 Interface Utilisateur Moderne
- **Design TikTok-like** intuitif
- **Tableaux de bord** en temps réel
- **Gestion multi-profils** simplifiée
- **Visualisations** interactives
- **Mode sombre** professionnel

## 🚀 Installation Rapide

### Prérequis
- **Node.js** 16+ 
- **PostgreSQL** 12+
- **Brave Browser** (recommandé)
- **Linux/Ubuntu** (testé sur Ubuntu 20.04+)

### Installation Automatique
```bash
# Cloner le projet
git clone <votre-repo>
cd "TikTok Live Analyser"

# Installation automatique
chmod +x install.sh
./install.sh

# Démarrage
npm start
```

### Installation Manuelle
```bash
# Dépendances système
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib brave-browser

# Dépendances du projet
npm run install-all

# Configuration base de données
sudo -u postgres createdb live_tracker
sudo -u postgres psql -d live_tracker -f live-tracker/database-forensic-complete.sql

# Démarrage
npm start
```

## 📁 Structure du Projet

```
TikTok Live Analyser/
├── 📱 frontend-react/          # Interface utilisateur React
│   ├── src/components/         # Composants React
│   ├── src/styles/            # Styles CSS
│   └── package.json           # Dépendances frontend
├── 🔧 live-tracker/           # Backend Node.js
│   ├── server.js              # Serveur principal
│   ├── enhanced-server.js     # Serveur amélioré
│   ├── tiktok-scraper-advanced.js # Scraper forensique
│   └── database-*.sql         # Schémas de base de données
├── 📊 evidence/               # Stockage des preuves
│   ├── profiles/              # Données de profils
│   ├── screenshots/           # Captures d'écran
│   ├── raw/                   # Données brutes
│   └── reports/               # Rapports générés
├── ⚙️ config.js               # Configuration globale
├── 🚀 app-launcher.js         # Lanceur principal
└── 📋 README-FINAL.md         # Documentation
```

## 🎮 Utilisation

### 1. Démarrage de l'Application
```bash
npm start
```
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

### 2. Analyse d'un Profil
1. Aller dans l'onglet **"Profils"**
2. Saisir le nom d'utilisateur (ex: `titilepirate3`)
3. Cliquer sur **"Analyser"**
4. Attendre la fin de l'extraction (1-2 minutes)

### 3. Capture Live
1. Aller dans l'onglet **"Analyser"**
2. Coller l'URL du live TikTok
3. Cliquer sur **"Analyser"**
4. Observer les données en temps réel

### 4. Exploration des Données
1. Onglet **"Database"** pour explorer les données
2. Requêtes SQL personnalisées
3. Export des résultats

## 🔧 Configuration

### Base de Données
Modifier `config.js`:
```javascript
database: {
  host: 'localhost',
  port: 5432,
  database: 'live_tracker',
  user: 'postgres',
  password: 'votre_mot_de_passe'
}
```

### Navigateur
```javascript
browser: {
  executablePath: '/snap/bin/brave', // ou '/usr/bin/google-chrome'
  headless: false, // true pour mode invisible
}
```

## 📊 Profils Prédéfinis

Le système inclut des profils prédéfinis pour tests:
- `@titilepirate3` - Gaming/Divertissement
- `@titi.le.pirate` - Contenu varié
- `@saadallahnordine` - Motivation
- `@sedsky777` - Humour
- `@historia_med` - Éducatif

## 🛡️ Sécurité et Conformité

### Intégrité des Données
- **Hachage SHA-256** de toutes les preuves
- **Horodatage** cryptographique
- **Chaîne de custody** documentée
- **Audit trail** complet

### Conformité Légale
- **RGPD** - Respect de la vie privée
- **Données publiques** uniquement
- **Traçabilité** complète des actions
- **Export** pour expertise judiciaire

## 🔍 Fonctionnalités Avancées

### Scraper Forensique
- **Retry automatique** avec backoff exponentiel
- **Sélecteurs multiples** pour robustesse
- **Interception réseau** complète
- **Screenshots** haute qualité
- **Métadonnées** techniques complètes

### Analyse en Temps Réel
- **WebSocket** interception
- **Données structurées** automatiquement
- **Statistiques** en direct
- **Alertes** configurables

## 🚨 Dépannage

### Problèmes Courants

**Erreur de connexion à la base de données:**
```bash
sudo systemctl start postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Mohand/06';"
```

**Brave Browser non trouvé:**
```bash
sudo apt install brave-browser
# ou modifier config.js pour utiliser Chrome
```

**Port déjà utilisé:**
```bash
sudo lsof -i :3000
sudo lsof -i :4000
# Tuer les processus si nécessaire
```

### Logs de Débogage
- **Frontend**: Console du navigateur
- **Backend**: `live-tracker/backend.log`
- **Scraper**: `live-tracker/tiktok-scraper.log`
- **Evidence**: `live-tracker/evidence.log`

## 📈 Performance

### Optimisations
- **Pool de connexions** PostgreSQL
- **Cache** des requêtes fréquentes
- **Pagination** automatique
- **Compression** des données

### Limites
- **200 commentaires** max en mémoire
- **50 profils** simultanés
- **1GB** max par session

## 🤝 Support

### Documentation
- `README-*.md` - Guides spécialisés
- `docs/` - Documentation technique
- Code commenté en français

### Contact
- **Email**: support@aura-forensic.com
- **Issues**: GitHub Issues
- **Wiki**: Documentation complète

## 📄 Licence

MIT License - Voir `LICENSE` pour les détails.

---

## 🎯 Roadmap

### Version 2.1 (Prochaine)
- [ ] **IA Analysis** - Détection automatique de contenu
- [ ] **Multi-plateforme** - Support Instagram/YouTube
- [ ] **API REST** complète
- [ ] **Dashboard** administrateur

### Version 2.2
- [ ] **Machine Learning** - Prédictions comportementales
- [ ] **Clustering** - Groupement d'utilisateurs
- [ ] **Géolocalisation** - Analyse par région
- [ ] **Export PDF** - Rapports professionnels

---

**🎯 TikTok Live Analyser - La solution forensique de référence pour l'analyse TikTok**