# 🚀 AURA - Lanceur Intégré

## Lancement de l'application

### Méthode 1 : Commande directe
```bash
npm start
```

### Méthode 2 : Double-clic
- Double-cliquez sur `AURA.desktop`

### Méthode 3 : Script bash
```bash
./start-app.sh
```

## Fonctionnalités

✅ **Lancement automatique** de tous les services Docker
✅ **Chromium intégré** avec l'interface AURA
✅ **Interface complète** dans le navigateur
✅ **Gestion automatique** des dépendances
✅ **Nettoyage automatique** à la fermeture

## Flux de lancement

1. 📦 Démarrage des services Docker (PostgreSQL, Redis, MinIO, Backend)
2. ⏳ Attente que les services soient prêts
3. 🌐 Lancement de Chromium avec l'interface AURA
4. 🎯 Interface disponible automatiquement

## Arrêt

- Fermez la fenêtre Chromium OU
- Appuyez sur `Ctrl+C` dans le terminal

L'application nettoiera automatiquement tous les services.