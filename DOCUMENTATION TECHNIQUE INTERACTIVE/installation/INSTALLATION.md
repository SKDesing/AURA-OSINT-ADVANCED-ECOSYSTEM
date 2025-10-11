# 🚀 INSTALLATION AURA OSINT

## ⚡ Installation rapide (recommandée)

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

Une fois installé :
```bash
npm run mvp:start
```

Interface disponible sur : http://localhost:3000