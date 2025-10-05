# 🦁 AURA - Version Brave Browser

## Pourquoi Brave ?

✅ **Anti-détection** - Brave a de meilleures protections
✅ **Bloqueur de pubs** intégré
✅ **Protection vie privée** renforcée
✅ **Compatible Chromium** - Même API que Chrome

## Lancement automatique

```bash
bash start-local-capture.sh
```

## Lancement manuel

1. **Ouvrir Brave avec debug**
```bash
/snap/bin/brave --remote-debugging-port=9222 --user-data-dir=/tmp/brave-debug
```

2. **Lancer la capture**
```bash
node capture-local-browser.js
```

## Test avec Historia Med

1. 🦁 **Brave s'ouvre** automatiquement
2. 🎯 **Va sur** : https://www.tiktok.com/@historia_med/live
3. 📊 **Données capturées** en temps réel
4. 💻 **Interface React** : http://localhost:3003

## Avantages Brave

- 🛡️ **Protection anti-bot** native
- 🚫 **Bloqueur de pubs** = pages plus rapides
- 🔐 **Tes sessions** TikTok préservées
- 📱 **Interface complète** TikTok
- 🎯 **Capture invisible** en arrière-plan