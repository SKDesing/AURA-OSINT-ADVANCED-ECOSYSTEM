# Standard de fichiers et emplacements OSINT (AURA)

## Objectif
- Standardiser où installer/packager chaque outil OSINT, sans polluer le dépôt.
- Éviter de "cloner" du code tiers dans le repo. Utiliser Docker en priorité.
- Définir dossiers communs (configs/données/scripts) et cas où un dossier par outil est requis.

## PRINCIPES
- Préférer Docker (images officielles, tags épinglés). Pas de binaires ni de vendor lourds dans Git.
- Containers éphémères "à la demande" pour CLI. Containers "long‑running" uniquement pour outils serveurs (SpiderFoot, PhoneInfoga).
- Secrets/API keys dans le Secret Manager (pas dans Git). Configs publiques en config/osint/, données de run dans var/osint/.

## ARBORESCENCE STANDARD (monorepo)
```
packages/core/src/osint/
  plugin.ts, registry.ts, adapters/<tool>/…           ← Code d'intégration unifié (contrats, parseurs)
apps/api/
  src/routes/osint.ts                                   ← Endpoints REST (jobs, results, stream)
  src/workers/osintWorker.ts                            ← Orchestrateur (BullMQ → Docker run)
infra/docker/osint/
  docker-compose.osint.yml                              ← Services long‑running (SpiderFoot, PhoneInfoga)
  <tool>/Dockerfile (si image custom nécessaire)
config/osint/
  <tool>/*.yaml|.json                                   ← Configs publiques (sans secrets)
  keys.template.json                                    ← Exemple structure des clés (sans valeurs)
var/osint/                                              ← Données d'exécution (NON versionnées)
  work/                                                 ← Dossiers temporaires par job (montés dans les containers)
  results/                                              ← Artefacts/export normalisés
  logs/                                                 ← Journaux d'exécution
  spiderfoot/                                           ← Persistance SpiderFoot
  phoneinfoga/                                          ← Persistance PhoneInfoga (si nécessaire)
scripts/osint/
  bootstrap-osint.sh                                    ← Prépare dossiers, images, checks
  run-<tool>.sh                                         ← Wrappers de run locaux (dev)
vendors/osint/                                          ← UNIQUEMENT si clone requis (rare)
  <tool>/ (git submodule, licence incluse)
```

## GITIGNORE (ajouter si manquant)
```
var/osint/**
vendors/osint/**/venv/**
vendors/osint/**/node_modules/**
vendors/osint/**/.env
```

## RÈGLES "CLONER OU PAS ?"
- **Par défaut**: NE PAS cloner. Utiliser Docker "docker run …".
- **Exceptions** (cloner en submodule vendors/osint/<tool>):
  - Outil non packagé, pas d'image fiable, patchs obligatoires.
  - Ajoutez: .gitmodules, licence du projet, et patches/ si vous modifiez.
  - Toujours "submodule" (pas de copie), marqué "vendored".

## MAPPING PAR OUTIL (où et comment)

### Amass
- **Mode**: Docker (caffix/amass) éphémère
- **Clone**: NON
- **Adapter**: packages/core/src/osint/adapters/amass.ts
- **Script**: scripts/osint/run-amass.sh
- **Data**: var/osint/work/<jobId>/amass.json

### Subfinder
- **Mode**: Docker (projectdiscovery/subfinder) éphémère
- **Clone**: NON
- **Adapter**: packages/core/src/osint/adapters/subfinder.ts
- **Script**: scripts/osint/run-subfinder.sh
- **Data**: var/osint/work/<jobId>/subfinder.json

### theHarvester
- **Mode**: Docker (python3 + pip theHarvester) ou apt (dev)
- **Clone**: NON
- **Adapter**: packages/core/src/osint/adapters/theharvester.ts
- **Script**: scripts/osint/run-theharvester.sh
- **Config**: config/osint/theharvester/sources.yaml (sans clés)
- **Data**: var/osint/work/<jobId>/theharvester.json

### Maigret / Sherlock / holehe
- **Mode**: Docker "python:slim" + pip install (build local image taggé), éphémère
- **Clone**: NON (sauf besoin patch → vendors/osint/<tool>)
- **Adapter**: packages/core/src/osint/adapters/{maigret|sherlock|holehe}.ts
- **Script**: scripts/osint/run-{maigret|sherlock|holehe}.sh
- **Data**: var/osint/work/<jobId>/{tool}.json

### ExifTool / mat2 / pdfid / pdf-parser
- **Mode**: Docker (exiftool official / debian + apt), éphémère
- **Clone**: NON
- **Adapter**: packages/core/src/osint/adapters/{exiftool|mat2|pdfid|pdfparser}.ts
- **Script**: scripts/osint/run-{tool}.sh
- **Data**: var/osint/work/<jobId>/files_meta.json

### SpiderFoot (serveur)
- **Mode**: Docker "spiderfoot/spiderfoot" long‑running via compose
- **Clone**: NON
- **Adapter**: packages/core/src/osint/adapters/spiderfoot.ts (API client)
- **Compose**: infra/docker/osint/docker-compose.osint.yml
- **Data**: var/osint/spiderfoot/ (volume)
- **UI**: géré par notre UI (pas l'UI SpiderFoot), via API

### PhoneInfoga (serveur optionnel)
- **Mode**: Docker "sundowndev/phoneinfoga" long‑running via compose (ou CLI éphémère)
- **Clone**: NON
- **Adapter**: packages/core/src/osint/adapters/phoneinfoga.ts
- **Compose**: infra/docker/osint/docker-compose.osint.yml
- **Data**: var/osint/phoneinfoga/ (si besoin)

## CONFIGS ET CLÉS API
- **Public** (sans secrets): config/osint/<tool>/*.yaml|json
- **Secrets**: Secret Manager uniquement; l'API récupère et injecte au run (jamais en clair en CLI/logs).
- **Example**: config/osint/keys.template.json → définit la forme attendue (Shodan/Censys/VirusTotal…)

## UI ET ORCHESTRATION
- L'UI Tool Runner lit la "metadata" des plugins (params) et génère les formulaires.
- Le Worker lance "docker run" avec volume "var/osint/work/<jobId>:/data".
- Les résultats sont parsés, normalisés (entités), stockés en base, explorables dans l'UI.
- Aucun outil tiers n'expose directement son UI au client final (sauf usage admin).

## RAPPEL LÉGAL/ÉTHIQUE
- Mode "passif" par défaut. Scans actifs derrière un toggle + avertissement + journalisation.
- Respect strict des ToS et des lois en vigueur.