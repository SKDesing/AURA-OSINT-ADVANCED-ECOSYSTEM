# 🧠 AURA Dorks Packs v1.1

Bibliothèque de requêtes Google Dorks spécialisées pour OSINT français, exécutées via SearXNG.

## 📦 Packs Disponibles

| Pack | Description | Variables | Dorks |
|------|-------------|-----------|-------|
| [fr-identity.yaml](dorks/fr-identity.yaml) | Identité personnes FR | full_name, city, username | 6 |
| [fr-company.yaml](dorks/fr-company.yaml) | Intelligence entreprise | company, domain, siren | 7 |
| [attack-surface.yaml](dorks/attack-surface.yaml) | Surface d'attaque safe | domain | 7 |

## 🚀 Utilisation

### Prérequis
- SearXNG accessible (ex: SEARXNG_URL=http://localhost:8080)
- Outils: curl, jq, yq (mikefarah/yq), python3, sha256sum
- Optionnel DB: DATABASE_URL (postgres://user:pass@host:5433/db)

### Via Makefile
```bash
export SEARXNG_URL=http://localhost:8080

# Pack identité
make dorks-pack PACK=osint-packs/dorks/fr-identity.yaml VARS='full_name="Alice Martin" city=Lyon'

# Pack entreprise
make dorks-pack PACK=osint-packs/dorks/fr-company.yaml VARS='company="ACME SAS" domain=acme.fr'

# Pack surface d'attaque
make dorks-pack PACK=osint-packs/dorks/attack-surface.yaml VARS='domain=example.com'
```

### Via Orchestrateur
```bash
export SEARXNG_URL=http://localhost:8080
./dorks-orchestrator.sh dorks-pack osint-packs/dorks/fr-identity.yaml full_name="John Doe" city=Paris
```

## 📋 Format YAML

```yaml
pack: "Nom du Pack"
version: "1.1"
locale: "fr-FR"
scope: "authorized-osint"
defaults:
  engine: "searxng"
  max_results: 50
  throttle_ms: 800
  lang: "fr"
variables:
  - { name: variable_name, required: true/false }
dorks:
  - id: unique_id
    title: "Description"
    query: 'requête avec {variable}'
    tags: ["tag1", "tag2"]
    outputs: ["url", "document"]
    risk: "low/medium"
```

## 🔒 Conformité & Sécurité

- ✅ **Scope autorisé**: `authorized-osint` uniquement
- ✅ **Via SearXNG**: Pas de scraping Google direct
- ✅ **Throttling**: 800ms entre requêtes par défaut
- ✅ **Risk scoring**: `low` pour usage standard
- ✅ **Déduplication**: SHA-256 sur URL

## 📊 Ingestion PostgreSQL

Résultats stockés dans `raw_events`:
- `source_tool`: "dorks_pack"
- `payload`: JSON avec dork_id, query, url, title, snippet
- `fingerprint`: SHA-256 de l'URL pour déduplication

## 🎯 Exemples de Résultats

### FR Identity
- Documents PDF mentionnant une personne
- Profils publics avec localisation
- Présence sur plateformes dev
- Publications académiques

### FR Company
- Politiques RGPD/sécurité
- Documents PDF corporate
- Offres d'emploi révélant la stack tech
- Mentions SIREN/SIRET

### Attack Surface
- Fichiers normatifs (robots.txt, sitemap.xml)
- Répertoires exposés
- Portails de connexion
- Endpoints API publics

## 🔧 Développement

### Ajouter un Nouveau Pack
1. Créer `osint-packs/dorks/nouveau-pack.yaml`
2. Définir variables et dorks
3. Tester: `make dorks-pack PACK=... VARS=...`
4. Vérifier ingestion: `make db-check`

### Bonnes Pratiques Dorks
- Utiliser guillemets pour correspondance exacte
- Pas d'espace après les opérateurs (`site:`, `-`)
- Exclure réseaux sociaux si non pertinent
- Limiter `max_results` pour éviter rate limiting
- Tester avec différents moteurs via SearXNG