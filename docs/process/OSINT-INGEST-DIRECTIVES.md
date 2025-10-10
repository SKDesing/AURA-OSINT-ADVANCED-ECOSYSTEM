# OSINT — Ingestion des sorties CLI vers NDJSON normalisés

## But
- Convertir les sorties brutes de subfinder/amass, Maigret et holehe en entités normalisées prêtes à être persistées (NDJSON).

## Entrées (à déposer)
- var/osint/raw/subdomains.txt
- var/osint/raw/maigret.log
- var/osint/raw/holehe.log

## Sorties
- var/osint/results/subdomains.ndjson   (type: "subdomain", value, ip?, source?)
- var/osint/results/accounts.ndjson     (type: "account", site, username?, url)
- var/osint/results/email_usage.ndjson  (type: "email_usage", site, email, status: used|not_used|rate_limited)

## Usage
```bash
node scripts/osint/normalize-samples.mjs
```

Les fichiers NDJSON sont prêts pour un import DB ou un POST futur vers /api/osint/results.

## Notes
- Si possible, privilégier à l'avenir les options machine-readables:
  - subfinder: -json -o …
  - amass: -json …
  - Maigret: utilisez les options d'export (CSV/PDF/JSON si disponibles) sinon log texte → parseur ci-dessous.
  - holehe: pas toujours JSON; le parseur texte gère les marqueurs [+], [-], [x].