# 🚀 INSTALLATION AURA OSINT

> 📋 **Documentation technique complète** : Voir [suivi-developpement.html](./suivi-developpement.html)
> 🏗️ **Architecture détaillée** : 17 outils OSINT + IA Qwen + WebSocket temps réel

## ⚡ Installation rapide (recommandée)

> ✅ **Version optimisée disponible** : `./RUN-AURA-OPTIMIZED.sh` (voir [logs techniques](./suivi-developpement.html#logs-techniques))

```bash
git clone https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git
cd AURA-OSINT-ADVANCED-ECOSYSTEM
npm run setup:full
```

## 📋 Installation étape par étape

### 1. Cloner le repository
```bash
git clone https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM.git
cd AURA-OSINT-ADVANCED-ECOSYSTEM
```

### 2. Installer les dépendances Node.js
```bash
npm install
```

### 3. Installer les outils OSINT
```bash
npm run setup:osint
# OU directement:
bash scripts/osint/install-osint-tools.sh
```

### 4. Installer l'IA locale
```bash
npm run setup:ai
# OU directement:
bash ai/local-llm/scripts/download-qwen2-1_5b.sh
```

### 5. Démarrer AURA
```bash
npm start
# OU pour l'interface web:
npm run mvp:start
```

## 🔍 Outils OSINT installés

- **Sherlock** - Recherche de noms d'utilisateur
- **Amass** - Reconnaissance de sous-domaines
- **Sublist3r** - Énumération de sous-domaines
- **SpiderFoot** - Reconnaissance automatisée
- **Recon-ng** - Framework de reconnaissance
- **Maltego** - Analyse de liens
- **Et 20+ autres outils...**

## 🧠 Modèles IA inclus

- **Qwen2 1.5B Instruct** - Modèle de langage local
- **Embeddings** - Pour l'analyse sémantique
- **Détection de harcèlement** - Classification automatique

## ❓ Dépannage

### Outils OSINT manquants
```bash
# Vérifier l'installation
which sherlock amass sublist3r

# Réinstaller si nécessaire
sudo apt update
sudo apt install kali-tools-osint
```

### Modèle IA non téléchargé
```bash
# Vérifier la présence
ls -la ai/local-llm/models/

# Retélécharger si nécessaire
bash ai/local-llm/scripts/download-qwen2-1_5b.sh
```

### Ports occupés
```bash
npm run ports:fix
```

## 🎯 Démarrage rapide

### Version Standard
```bash
npm run mvp:start
```

### Version Optimisée (Recommandée)
```bash
./RUN-AURA-OPTIMIZED.sh
```
**Avantages** :
- ⚡ +40% performance (voir [métriques](./suivi-developpement.html#metriques-performance))
- 🔧 Configuration centralisée
- 📊 Logs forensiques intégrés
- 🤖 IA Qwen sur port unifié 4011

## 🔍 Vérification Installation

### Statut des Services
```bash
# Vérifier tous les services
curl http://localhost:4011/api/health

# Tester l'IA
curl -X POST http://localhost:4011/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Analyse l'email test@example.com"}'

# Lister les outils OSINT
curl http://localhost:4011/api/osint/tools
```

### Logs de Diagnostic
```bash
# Logs système temps réel
tail -f backend/logs/combined.log

# Logs d'erreurs
tail -f backend/logs/error.log

# Logs forensiques
ls -la logs/forensic/
```

## 📊 Architecture Technique

### Services Principaux
| Service | Port | Description | Statut |
|---------|------|-------------|--------|
| API Unifiée | 4011 | REST + WebSocket | ✅ Opérationnel |
| Qwen IA | 4011 | Moteur intelligence | ✅ Intégré |
| PostgreSQL | 5432 | Base données | 🐳 Docker |
| Redis | 6379 | Cache/Sessions | 🐳 Docker |
| Elasticsearch | 9200 | Recherche | 🐳 Docker |
| Qdrant | 6333 | Vecteurs IA | 🐳 Docker |

### Outils OSINT par Catégorie
| Catégorie | Outils | Commande Test |
|-----------|--------|---------------|
| **Phone** (2) | phoneinfoga, phonenumbers | `curl localhost:4011/api/osint/tools/phone` |
| **Username** (2) | sherlock, maigret | `curl localhost:4011/api/osint/tools/username` |
| **Network** (5) | shodan, nmap, ssl_analyzer | `curl localhost:4011/api/osint/tools/network` |
| **Email** (1) | holehe | `curl localhost:4011/api/osint/tools/email` |
| **Domain** (2) | subfinder, whois | `curl localhost:4011/api/osint/tools/domain` |

## 🚨 Résolution Problèmes Avancés

### Problème : Services ne démarrent pas
**Cause** : Conflits de ports ou dépendances manquantes
```bash
# Diagnostic complet
./optimize-complete.sh --check-health

# Nettoyer et redémarrer
pkill -f "node.*qwen"
docker-compose down && docker-compose up -d
./RUN-AURA-OPTIMIZED.sh
```

### Problème : IA ne répond pas
**Cause** : Modèle Qwen non chargé ou configuration incorrecte
```bash
# Vérifier modèle IA
ls -la ai/local-llm/models/

# Recharger configuration optimisée
source optimized/config/.env
cd ai-engine && node qwen-integration.js
```

### Problème : Outils OSINT échouent
**Cause** : Permissions ou dépendances Python manquantes
```bash
# Réinstaller environnement Python
source venv-osint/bin/activate
pip install -r requirements.txt

# Tester outil spécifique
python tools/sherlock/sherlock.py --help
```

## 📈 Monitoring et Maintenance

### Surveillance Système
```bash
# Métriques temps réel
watch -n 1 'curl -s localhost:4011/api/health | jq'

# Utilisation ressources
docker stats

# Logs forensiques quotidiens
ls -la logs/forensic/security_$(date +%Y-%m-%d).log
```

### Optimisation Continue
```bash
# Réexécuter optimisation
./optimize-complete.sh

# Rapport de performance
cat optimization-report.md

# Analyse logs pour amélioration
grep "ERROR\|WARN" backend/logs/combined.log | tail -20
```

**Interfaces disponibles** :
- 🌐 **Interface Standard** : http://localhost:3000
- 🤖 **IA Chat** : http://localhost:4011/chat
- 📊 **API Documentation** : http://localhost:4011
- 🔧 **Monitoring** : http://localhost:4011/api/health

---

## 📚 Documentation Complémentaire

- 📋 **[Suivi Développement](./suivi-developpement.html)** - Historique technique complet
- 📊 **[Rapport Optimisation](./optimization-report.md)** - Métriques de performance
- 🔧 **[Configuration](./optimized/config/)** - Paramètres centralisés
- 📝 **[Logs](./backend/logs/)** - Diagnostic système temps réel