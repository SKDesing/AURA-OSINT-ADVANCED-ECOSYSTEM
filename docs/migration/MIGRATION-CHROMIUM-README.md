# 🔄 AURA Migration: Brave → Chromium Only

## 🎯 Objectif

Migrer complètement AURA de Brave vers Chromium pour une meilleure compatibilité universelle, moins de dépendances et une maintenance simplifiée.

## 📋 Avant la Migration

### Fichiers Brave détectés à supprimer :
- `launch-brave.js` - Lanceur Brave principal
- `brave-portable-downloader.js` - Téléchargeur Brave Portable  
- `live-tracker/brave-launcher.js` - Lanceur Brave pour tracking
- `src/utils/getBravePath.js` - Détecteur de chemin Brave

### Fichiers à mettre à jour :
- `LANCER-APPLICATION.bat` - Script Windows
- `scripts/deployment/install.sh` - Installation système
- `app-launcher.js` - Lanceur d'application
- `live-tracker/server.js` - Serveur de tracking
- `docs/guides/LIRE-MOI.html` - Documentation
- `CHANGELOG.md` - Journal des modifications

## 🚀 Exécution de la Migration

### 1. Lancer la migration automatique
```bash
node migrate-to-chromium.js
```

### 2. Vérifier la migration
```bash
node test-chromium-migration.js
```

### 3. Installer Chromium (si nécessaire)
```bash
./install-chromium.sh
```

## 📦 Nouveaux Fichiers Créés

### `src/utils/getChromiumPath.js`
- Détection automatique du chemin Chromium selon l'OS
- Support Linux, macOS, Windows
- Fallback vers Puppeteer bundled Chromium

### `chromium-launcher.js`
- Lanceur Chromium unifié
- Configuration sécurisée par défaut
- Support headless et interface graphique

### `install-chromium.sh`
- Installation automatique Chromium
- Support multi-distributions Linux
- Support macOS via Homebrew

## 🔧 Utilisation Post-Migration

### Lancement Chromium programmatique
```javascript
const ChromiumLauncher = require('./chromium-launcher');

const launcher = new ChromiumLauncher({
    headless: false,
    devtools: true
});

const browser = await launcher.launch();
```

### Détection de chemin Chromium
```javascript
const ChromiumPathDetector = require('./src/utils/getChromiumPath');

const chromiumPath = ChromiumPathDetector.detect();
const profileDir = ChromiumPathDetector.getProfileDir();
```

### Configuration Puppeteer
```javascript
const puppeteer = require('puppeteer');
const ChromiumPathDetector = require('./src/utils/getChromiumPath');

const browser = await puppeteer.launch({
    executablePath: ChromiumPathDetector.detect(),
    userDataDir: ChromiumPathDetector.getProfileDir(),
    headless: true
});
```

## ✅ Avantages de la Migration

### 🛡️ Sécurité
- Configuration sécurisée par défaut (`--no-sandbox`, `--disable-setuid-sandbox`)
- Pas de dépendances externes non contrôlées
- Profils isolés pour AURA

### 🌍 Compatibilité Universelle
- Support natif sur tous les OS
- Meilleure intégration CI/CD
- Compatible Docker et conteneurs

### 🔧 Maintenance Simplifiée
- Une seule dépendance navigateur
- Moins de code à maintenir
- Configuration centralisée

### ⚡ Performance
- Chromium optimisé et stable
- Puppeteer bundled en fallback
- Démarrage plus rapide

## 🧪 Tests de Validation

### Test complet
```bash
node test-chromium-migration.js
```

### Test d'installation Chromium
```bash
./install-chromium.sh --check
```

### Test de lancement
```bash
node -e "
const ChromiumLauncher = require('./chromium-launcher');
const launcher = new ChromiumLauncher({ headless: true });
launcher.launch().then(browser => {
    console.log('✅ Chromium lancé avec succès');
    return browser.close();
}).catch(console.error);
"
```

## 🔄 Rollback (si nécessaire)

En cas de problème, les fichiers originaux sont sauvegardés dans :
```
backup_brave_migration_[timestamp]/
```

Pour restaurer :
```bash
# Exemple de restauration manuelle
cp backup_brave_migration_*/launch-brave.js ./
cp backup_brave_migration_*/brave-portable-downloader.js ./
# etc...
```

## 📊 Checklist Post-Migration

- [ ] ✅ Fichiers Brave supprimés
- [ ] ✅ Fichiers Chromium créés  
- [ ] ✅ Tests de migration passés
- [ ] ✅ Chromium installé sur le système
- [ ] ✅ Configuration Puppeteer mise à jour
- [ ] ✅ Documentation mise à jour
- [ ] ✅ Tests fonctionnels AURA passés

## 🆘 Support

En cas de problème :
1. Vérifier les logs de migration
2. Exécuter `node test-chromium-migration.js`
3. Vérifier l'installation Chromium avec `./install-chromium.sh --check`
4. Consulter les backups dans `backup_brave_migration_*/`

## 🎉 Résultat Final

**AURA utilise maintenant Chromium uniquement** avec :
- ✅ Configuration sécurisée et universelle
- ✅ Compatibilité maximale (Linux, macOS, Windows)
- ✅ Maintenance simplifiée
- ✅ Performance optimisée
- ✅ Prêt pour déploiement cloud/Docker