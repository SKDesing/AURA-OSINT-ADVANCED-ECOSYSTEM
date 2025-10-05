# 🚀 AURA - Version Navigateur Local

## Lancement avec ton Chromium

### Méthode automatique
```bash
./start-local-capture.sh
```

### Méthode manuelle

1. **Démarrer les services**
```bash
docker-compose up -d
```

2. **Lancer ton Chromium avec debug**
```bash
chromium-browser --remote-debugging-port=9222 --user-data-dir=/tmp/chromium-debug
```

3. **Lancer la capture**
```bash
node capture-local-browser.js
```

4. **Ouvrir l'interface React**
```bash
cd frontend-react && npm start
```

## Utilisation

1. ✅ **Chromium s'ouvre** automatiquement
2. 🎯 **Va sur le live TikTok** : https://www.tiktok.com/@historia_med/live
3. 📊 **Les données sont capturées** automatiquement
4. 💻 **Interface React** : http://localhost:3003

## Avantages

- 🌐 **Ton navigateur complet** avec toutes les fonctionnalités
- 🔐 **Tes cookies/sessions** TikTok déjà connectées
- 📱 **Interface native** TikTok complète
- 🚀 **Capture invisible** en arrière-plan

## Données capturées

- 💬 Commentaires avec badges utilisateur
- 🎁 Cadeaux et donations
- 👥 Nombre de spectateurs
- ❤️ Likes et interactions