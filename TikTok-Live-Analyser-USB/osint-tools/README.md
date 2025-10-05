# 🔍 Outils OSINT Intégrés

## Installation Automatique

```bash
# Exécuter le script d'installation
./install-tools.sh
```

## Outils Disponibles

### 1. Sherlock
- **Fonction**: Recherche de pseudonymes sur 400+ sites
- **Usage**: Vérifier la présence d'un nom d'utilisateur sur les réseaux sociaux
- **API**: `/api/osint/sherlock/search`

### 2. theHarvester
- **Fonction**: Collecte d'emails, domaines, sous-domaines
- **Usage**: Reconnaissance passive via moteurs de recherche
- **API**: `/api/osint/harvester/search`

### 3. SpiderFoot
- **Fonction**: Reconnaissance automatique et corrélation
- **Usage**: Scan complet d'une cible (IP/domaine)
- **API**: `/api/osint/spiderfoot/scan`

### 4. ExifTool
- **Fonction**: Analyse de métadonnées des fichiers médias
- **Usage**: Extraction d'informations sensibles (GPS, appareil, etc.)
- **API**: `/api/osint/exiftool/analyze`

## Interface Web

Accédez à l'interface OSINT via:
- **URL**: http://localhost:3000/osint-tools.html
- **Intégration**: Directement dans l'application principale

## Utilisation Forensique

Tous les outils sont configurés pour:
- ✅ Préservation de l'intégrité des preuves
- ✅ Logging complet des opérations
- ✅ Export des résultats en JSON
- ✅ Horodatage cryptographique
- ✅ Traçabilité des sources

## Sécurité

- Exécution en environnement isolé
- Pas de connexions externes non autorisées
- Chiffrement des données sensibles
- Audit trail complet