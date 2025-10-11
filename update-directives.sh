#!/bin/bash

echo "📝 MISE À JOUR DE DIRECTIVES.md"
echo "════════════════════════════════════════════════════════════"

DIRECTIVES_FILE="DOCUMENTATION TECHNIQUE INTERACTIVE/roadmap/DIRECTIVES.md"

# Vérifier si DIRECTIVES.md existe
if [ ! -f "$DIRECTIVES_FILE" ]; then
    echo "❌ Fichier DIRECTIVES.md introuvable"
    exit 1
fi

# Créer une sauvegarde
cp "$DIRECTIVES_FILE" "$DIRECTIVES_FILE.backup"

# Ajouter la nouvelle section à la fin du fichier
cat >> "$DIRECTIVES_FILE" << 'EOF'


## 16. GESTION DES BUGS ET SOLUTIONS

### 16.1 Historique des Bugs Rencontrés

#### Bug #001: Conflit de Ports (EADDRINUSE)
- **Description**: Le port 4011 était déjà utilisé lors du lancement
- **Symptôme**: `Error: listen EADDRINUSE: address already in use :::4011`
- **Cause**: Processus précédents non terminés correctement
- **Solution**: Script de nettoyage automatique avant lancement
- **Statut**: ✅ RÉSOLU

#### Bug #002: Erreur de Protocole Electron
- **Description**: `protocol.registerSchemesAsPrivileged should be called before app is ready`
- **Symptôme**: TypeError lors du lancement d'AURA Browser
- **Cause**: Enregistrement des protocoles après initialisation de l'app
- **Solution**: Déplacement de l'enregistrement avant l'initialisation
- **Statut**: ✅ RÉSOLU

#### Bug #003: Erreurs GLib-GObject
- **Description**: `GLib-GObject: instance has no handler with id`
- **Symptôme**: Messages d'erreur dans la console lors du lancement
- **Cause**: Problème de compatibilité avec l'environnement graphique Linux
- **Impact**: Esthétique uniquement, n'affecte pas le fonctionnement
- **Solution**: Utilisation de flags --disable-gpu si nécessaire
- **Statut**: ✅ RÉSOLU (contournement)

### 16.2 Architecture des Fichiers Actuelle

#### Structure Finale
```
AURA-OSINT-ADVANCED-ECOSYSTEM/
├── backend/                    # API backend
├── aura-browser/               # Interface Electron
│   ├── chromium-engine-branded.js  # Moteur principal AURA Browser
│   └── package.json            # Configuration
├── config/                     # Configuration centralisée
│   └── ports.json              # Configuration des ports
├── docker-compose.yml          # Services Docker
├── RUN-AURA-COMPLETE.sh        # Script de lancement principal
└── archive/obsolete/           # Fichiers obsolètes archivés
```

### 16.3 Scripts de Lancement

#### Script Principal Actuel
- **Fichier**: `RUN-AURA-COMPLETE.sh`
- **Fonction**: Lancement complet de l'écosystème AURA OSINT
- **Composants lancés**:
  - Bases de données (PostgreSQL, Redis, Elasticsearch, Qdrant)
  - Backend API (port 4011)
  - AURA Browser (interface brandée)

#### Scripts Obsolètes (Archivés)
- `launch-aura-complete.js`
- `launch-aura-fixed.js`
- `launch-aura-configured.js`
- `launch-full-ecosystem.js`
- `start-ecosystem.sh`
- `quick-fix.sh`

### 16.4 AURA Browser - Branding Final

#### Caractéristiques
- **Nom officiel**: AURA Browser
- **Titre**: "AURA Browser - OSINT Investigation Platform"
- **Design**: Basé sur Golden Ratio (Φ = 1.618)
- **Interface**: Dashboard complet avec statut des services
- **Fichier principal**: `chromium-engine-branded.js`

#### Fonctionnalités
- Vérification automatique des services
- Interface moderne avec animations
- Boutons d'action pour les outils OSINT
- Footer avec informations de version

### 16.5 Bonnes Pratiques

#### Avant Lancement
1. Exécuter `./cleanup-obsolete.sh` pour nettoyer les fichiers obsolètes
2. Vérifier qu'aucun processus n'utilise les ports requis
3. S'assurer que Docker est fonctionnel

#### Lancement Standard
```bash
./RUN-AURA-COMPLETE.sh
```

#### Pour le Debugging
1. Utiliser les logs de Docker pour les bases de données
2. Vérifier les logs du backend
3. Utiliser DevTools dans AURA Browser pour le frontend
EOF

echo "✅ DIRECTIVES.md mis à jour avec succès"
echo "💾 Sauvegarde créée: $DIRECTIVES_FILE.backup"