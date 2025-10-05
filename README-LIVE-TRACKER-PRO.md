# 🎯 LIVE TRACKER PRO
## Architecture Forensic de Niveau Entreprise

### 🏆 **Ce qui rend LIVE TRACKER PRO exceptionnel**

**LIVE TRACKER PRO** n'est pas un simple scraper. C'est une **plateforme d'investigation forensic** conçue pour les journalistes, enquêteurs et analystes qui ont besoin de preuves incontestables.

---

## 🔒 **Architecture de Preuve Inviolable**

### **1. Intégrité Cryptographique**
- **Hash SHA-256** pour chaque donnée capturée
- **Chaîne d'intégrité** de session complète
- **Archivage des données brutes** (preuve absolue)
- **Traçabilité complète** (qui, quand, comment)

### **2. Extraction Multi-Niveaux**
```
📡 WebSocket TikTok
    ↓
🔍 Interception Temps Réel
    ↓
📦 Archive Brute (JSON complet)
    ↓
🧠 Parsing Intelligent
    ↓
🔐 Hash de Preuve
    ↓
💾 Base Forensic
    ↓
📊 Interface Analyste
```

### **3. Données Capturées**

#### **Commentaires Enrichis**
- `user_id`, `unique_id`, `nickname`
- `content` (texte du commentaire)
- `create_time` (timestamp TikTok)
- `captured_at` (timestamp de capture)
- `is_moderator`, `is_owner`, `is_vip`
- `profile_picture_url`
- `evidence_hash` (preuve d'intégrité)
- `message_sequence` (ordre chronologique)

#### **Cadeaux avec Valeur Économique**
- `gift_id`, `gift_name`, `gift_count`
- `gift_price` (valeur en coins TikTok)
- `sender_user_id`, `sender_nickname`
- Calcul automatique de la **valeur totale**

#### **Statistiques de Room**
- `viewer_count` (spectateurs en temps réel)
- `like_count` (likes cumulés)
- Évolution temporelle des audiences

#### **Métadonnées de Session**
- `room_id` (identifiant unique du live)
- `streamer_username`, `streamer_id`
- `analyst_id` (qui a lancé la capture)
- `user_agent`, `ip_address`

---

## 🚀 **Démarrage Rapide**

### **Installation**
```bash
# Cloner le projet
git clone https://github.com/SKDesing/TikTok-Live-Analyser.git
cd "TikTok Live Analyser"

# Installer les dépendances
cd live-tracker && npm install
cd ../frontend-react && npm install

# Démarrer le système complet
cd ..
./start-live-tracker.sh
```

### **Accès**
- **Interface Analyste** : http://localhost:3000
- **API Backend** : http://localhost:4000
- **Logs Forensic** : `live-tracker/evidence-audit.log`

---

## 📊 **Base de Données Forensic**

### **Tables Principales**
- `sessions` - Sessions de capture avec traçabilité
- `comments` - Commentaires avec hash d'intégrité
- `gifts` - Cadeaux avec valeur économique
- `raw_evidence` - Archive complète des données brutes
- `user_profiles` - Profils enrichis avec score de risque
- `tags` - Système de classification manuelle
- `audit_log` - Journal complet des actions

### **Vues Analytiques**
- `session_analytics` - Résumé complet par session
- `high_risk_users` - Utilisateurs à surveiller

### **Fonctions Automatiques**
- Calcul automatique des **scores de risque**
- Mise à jour des **profils utilisateurs**
- Génération des **hash d'intégrité de session**

---

## 🎮 **Utilisation**

### **1. Démarrer une Session**
1. Ouvrir l'interface : http://localhost:3000
2. Entrer le **titre** de l'enquête
3. Coller l'**URL du live TikTok**
4. Cliquer **"Démarrer Session"**
5. Brave s'ouvre avec votre session → naviguer vers le live

### **2. Monitoring Temps Réel**
- **Commentaires** apparaissent instantanément
- **Badges** automatiques (OWNER, MOD, VIP)
- **Hash de preuve** visible pour chaque donnée
- **Statistiques** mises à jour en continu

### **3. Analyse Post-Capture**
- **Historique** de toutes les sessions
- **Statistiques** complètes par session
- **Export** des données (JSON/CSV)
- **Recherche** et filtrage avancés

---

## 🔧 **Configuration Avancée**

### **Variables d'Environnement**
```bash
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=live_tracker_pro
DB_USER=postgres
DB_PASSWORD=Mohand/06

# Serveur
PORT=4000
NODE_ENV=production

# Logging
LOG_LEVEL=info
LOG_FILE=evidence-audit.log
```

### **Profil Brave Personnalisé**
Le système utilise votre profil Brave existant :
```
~/.config/BraveSoftware/Brave-Browser
```

---

## 🛡️ **Sécurité et Conformité**

### **Intégrité des Preuves**
- **Hash SHA-256** pour chaque donnée
- **Horodatage cryptographique**
- **Chaîne de custody** complète
- **Audit trail** de toutes les actions

### **Protection des Données**
- **Chiffrement** des données sensibles
- **Anonymisation** optionnelle
- **Rétention** configurable
- **Export sécurisé**

### **Conformité Légale**
- **RGPD** compatible
- **Chain of custody** juridique
- **Preuves admissibles** en justice
- **Documentation** complète

---

## 📈 **Cas d'Usage**

### **Journalisme d'Investigation**
- Documenter le **harcèlement en ligne**
- Analyser la **désinformation**
- Traquer les **campagnes coordonnées**
- Mesurer l'**impact des lives**

### **Recherche Académique**
- Étudier les **comportements sociaux**
- Analyser les **tendances virales**
- Mesurer l'**engagement des audiences**
- Recherche en **sciences sociales**

### **Modération de Contenu**
- Détecter les **contenus toxiques**
- Identifier les **comptes suspects**
- Analyser les **patterns de spam**
- **Scoring automatique** des risques

---

## 🔮 **Roadmap**

### **Phase 2 : IA Intégrée**
- **Détection automatique** de toxicité
- **Classification** des commentaires
- **Analyse de sentiment** en temps réel
- **Détection d'anomalies**

### **Phase 3 : Multi-Plateforme**
- **YouTube Live** support
- **Twitch** integration
- **Instagram Live** capture
- **Interface unifiée**

### **Phase 4 : Collaboration**
- **Multi-utilisateurs**
- **Partage de sessions**
- **Annotations collaboratives**
- **Rapports automatiques**

---

## 📞 **Support**

### **Documentation**
- **API Reference** : `/docs/api.md`
- **Database Schema** : `/docs/database.md`
- **Deployment Guide** : `/docs/deployment.md`

### **Logs et Debugging**
```bash
# Logs en temps réel
tail -f live-tracker/evidence-audit.log

# Logs d'erreur
tail -f live-tracker/evidence-error.log

# Status des services
systemctl status postgresql
```

---

**LIVE TRACKER PRO** - *Transforming Live Data into Legal Evidence*

🔒 **Forensic-Grade** • 🎯 **Investigation-Ready** • ⚡ **Real-Time** • 🛡️ **Secure**