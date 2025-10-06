# 🔍 OSINT Suite Avancée (Ubuntu/Kali)

Suite d'outils OSINT 100% open-source avec infra Docker (PostgreSQL, Elasticsearch, Kibana, SearXNG) et orchestrateur Bash. Compatible Ubuntu/Kali.

## Prérequis
- Ubuntu/Kali récent
- Docker + docker compose plugin
- make

## Installation
```bash
make install
cp .env.example .env
make setup
```

Services:
- Postgres: localhost:5433
- Elasticsearch: http://localhost:9200 (xpack off)
- Kibana: http://localhost:5601
- SearXNG: http://localhost:8080

## 🛠️ Outils Intégrés

### Reconnaissance Domaines
- **Amass** (OWASP) - Énumération sous-domaines
- **Subfinder** (ProjectDiscovery) - Découverte passive/active
- **DNSx** - Résolution DNS massive
- **HTTPx** - Probing HTTP + détection techno
- **Nuclei** - Scan sécurité avec templates

### Archives & Crawling
- **Waybackurls** - URLs archivées Wayback Machine
- **GAU** - GetAllUrls (Common Crawl)
- **Katana** - Crawler moderne
- **GoWitness** - Screenshots automatisés

### OSINT Identités
- **Sherlock** - Recherche pseudos multi-plateformes
- **Holehe** - Vérification emails sur services
- **Maigret** - Recensement comptes utilisateur

### Infrastructure
- **SearXNG** - Métamoteur safe pour dorks
- **PostgreSQL** - Stockage données OSINT
- **Elasticsearch** - Indexation et recherche
- **Kibana** - Visualisation données

## 📋 Commandes Disponibles

```bash
# Reconnaissance complète
make recon DOMAIN=target.com

# Recherche dorks spécialisée
make dorks DOMAIN=target.com

# Archives historiques
make archive DOMAIN=target.com

# OSINT identités
make people TARGET=username

# Status infrastructure
make status

# Nettoyage
make clean
```

## 🎯 Exemples d'Usage

### Reconnaissance Domaine
```bash
make recon DOMAIN=example.com
# Génère: osint_example.com_YYYYMMDD_HHMM/
# - live_subdomains.txt
# - httpx.json
# - nuclei.json
# - screenshots/
# - osint_report.json
```

### Recherche Dorks
```bash
make dorks DOMAIN=example.com
# Recherche via SearXNG:
# - PDF documents
# - Fichiers Excel
# - Fichiers config
```

### OSINT Identités
```bash
make people TARGET=john_doe
# Génère:
# - holehe_john_doe.txt (emails)
# - sherlock_john_doe.txt (comptes)
# - maigret_john_doe.json (profils)
```

## 🔒 Conformité & Légal

- ✅ Outils 100% open-source
- ✅ Pas de scraping direct Google
- ✅ SearXNG comme proxy métamoteur
- ✅ Respect robots.txt
- ✅ Usage sur cibles autorisées uniquement

## 📊 Intégration AURA

Les résultats sont exportés en JSON/JSONL pour intégration dans:
- Base PostgreSQL AURA
- Pipeline analytics
- Dashboard Kibana
- API OSINT Intelligence Engine

## 🌐 Services Web

Après `make setup`:
- **SearXNG**: http://localhost:8080
- **Kibana**: http://localhost:5601
- **PostgreSQL**: localhost:5433

## 🔧 Configuration Avancée

### Templates Nuclei Personnalisés
```bash
# Ajouter templates custom
mkdir -p ~/.nuclei-templates/custom/
# Éditer templates YAML
```

### Dorks Personnalisés
```bash
# Éditer liste dorks
vim dorks/custom-dorks.txt
# Format: site:{domain} filetype:pdf "confidential"
```

## 📈 Métriques & Monitoring

- Logs structurés JSON
- Métriques Prometheus (via Nuclei)
- Dashboards Kibana pré-configurés
- Alertes sur découvertes critiques