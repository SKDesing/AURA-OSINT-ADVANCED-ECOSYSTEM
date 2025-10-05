# 🎯 TikTok Live Extractor avec Brave

## Architecture Simplifiée

Ce système utilise votre session Brave existante (avec vos mots de passe) pour extraire les données TikTok Live en temps réel.

### Composants

1. **Backend Extracteur** (`brave-extractor/`) - Se connecte à votre Brave
2. **Frontend React** (`frontend-react/`) - Interface de visualisation
3. **Script de démarrage** (`start-extractor.sh`) - Lance tout automatiquement

## 🚀 Utilisation

### Démarrage rapide
```bash
./start-extractor.sh
```

### Démarrage manuel

1. **Backend :**
```bash
cd brave-extractor
npm start
```

2. **Frontend :**
```bash
cd frontend-react  
npm start
```

## 🎮 Comment ça marche

1. **Connectez-vous à TikTok** dans votre Brave habituel
2. **Lancez l'extracteur** avec `./start-extractor.sh`
3. **Ouvrez l'interface** sur http://localhost:3000
4. **Entrez l'URL** du live TikTok
5. **Cliquez "Démarrer"** - Brave s'ouvre avec votre session
6. **Naviguez vers le live** dans la fenêtre Brave qui s'ouvre
7. **Les données apparaissent** automatiquement dans l'interface

## 📊 Données extraites

- **Commentaires** avec nom d'utilisateur, contenu, badges (MOD, VIP, OWNER)
- **Cadeaux** avec nom du cadeau et expéditeur
- **Statistiques** en temps réel

## 🔧 Configuration

Le système utilise :
- **Port 4001** pour le backend
- **Port 3000** pour le frontend
- **Votre profil Brave** existant avec vos connexions

## 🛠️ Dépannage

### Brave ne se lance pas
```bash
# Vérifier le chemin Brave
which brave-browser
```

### Pas de données
1. Vérifiez que vous êtes connecté à TikTok
2. Naviguez manuellement vers le live dans la fenêtre Brave
3. Regardez la console du navigateur (F12)

### Erreur de connexion
- Redémarrez le système avec `./start-extractor.sh`
- Vérifiez que les ports 3000 et 4001 sont libres

## 📝 Notes importantes

- **Session persistante** : Utilise votre profil Brave avec vos mots de passe
- **Pas de re-connexion** : Vous restez connecté à TikTok
- **Extraction temps réel** : Les données apparaissent instantanément
- **Interface moderne** : React TypeScript avec Socket.IO