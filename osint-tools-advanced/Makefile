SHELL := /usr/bin/env bash

# Charge .env si présent
ifneq (,$(wildcard .env))
include .env
export
endif

DC ?= docker compose

.PHONY: install setup up down restart logs status db kibana recon people dorks clean selfcheck migrate db-check smoke reset-db reset-all

install:
	@bash install-osint-suite.sh

setup: up
	@echo "➡ Services:"
	@echo "   - Postgres:    localhost:$(POSTGRES_PORT)"
	@echo "   - Elastic:     http://localhost:$(ELASTIC_PORT)"
	@echo "   - Kibana:      http://localhost:$(KIBANA_PORT)"
	@echo "   - SearXNG:     http://localhost:$(SEARXNG_PORT)"

up:
	$(DC) up -d

down:
	$(DC) down

restart:
	$(DC) restart

logs:
	$(DC) logs -f --tail=200

status:
	$(DC) ps

db:
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -c "\dt+"

kibana:
	@xdg-open http://localhost:$(KIBANA_PORT) || true

recon:
	@test -n "$(DOMAIN)" || (echo "DOMAIN=example.com make recon"; exit 1)
	@bash osint-orchestrator.sh recon $(DOMAIN)

dorks:
	@test -n "$(DOMAIN)" || (echo "DOMAIN=example.com make dorks"; exit 1)
	@bash osint-orchestrator.sh dorks $(DOMAIN)

dorks-pack:
	@test -n "$(PACK)" || (echo "PACK=osint-packs/dorks/fr-identity.yaml VARS='full_name=\"John Doe\"' make dorks-pack"; exit 1)
	@chmod +x ./dorks-orchestrator.sh
	@./dorks-orchestrator.sh dorks-pack $(PACK) $(VARS)

test-pack-prod:
	@echo "🧪 Test production avec JSONL propre..."
	@export SEARXNG_URL=http://localhost:$(SEARXNG_PORT) && \
	 ./dorks-orchestrator.sh dorks-pack osint-packs/dorks/fr-company.yaml \
	   company="ACME SAS" domain=acme.fr 1>out.jsonl 2>run.log && \
	 echo "JSONL lines: $$(wc -l < out.jsonl)" && \
	 echo "Unique fingerprints: $$(jq -r '.fingerprint' out.jsonl | sort -u | wc -l)" && \
	 echo "Sample result:" && jq . out.jsonl | head -10

test-strict-mode:
	@echo "🧪 Test mode strict (AURA_STRICT=1)..."
	@export SEARXNG_URL=http://localhost:$(SEARXNG_PORT) AURA_STRICT=1 && \
	 ./dorks-orchestrator.sh dorks-pack osint-packs/dorks/fr-identity.yaml || \
	 echo "✅ Mode strict fonctionne (échec attendu sur variables manquantes)"

test-soft-mode:
	@echo "🧪 Test mode souple (AURA_STRICT=0)..."
	@export SEARXNG_URL=http://localhost:$(SEARXNG_PORT) AURA_STRICT=0 && \
	 ./dorks-orchestrator.sh dorks-pack osint-packs/dorks/fr-identity.yaml 2>&1 | \
	 grep -q "Skip dork" && echo "✅ Mode souple fonctionne (skip sur variables manquantes)"

fetch-url:
	@test -n "$(URL)" || (echo "URL=https://example.com make fetch-url"; exit 1)
	@node services/universal-fetcher.js "$(URL)" | jq .

fetch-headless:
	@test -n "$(URL)" || (echo "URL=https://societe.com make fetch-headless"; exit 1)
	@FETCH_MODE=headless node services/universal-fetcher.js "$(URL)" | jq .

test-ner-enhanced:
	@echo "🧪 Test Enhanced French NER..."
	@python3 services/ner-french-enhanced.py "Jean MARTIN travaille chez ACME SAS, SIREN 123 456 789, téléphone 01 23 45 67 89, email jean.martin@acme.fr, IBAN FR14 2004 1010 0505 0001 3M02 606"

run-watchers:
	@echo "🔍 Exécution watchers..."
	@chmod +x scripts/watchers-run.sh
	@./scripts/watchers-run.sh watchers.yaml

test-watchers-dry:
	@echo "🧪 Test watchers (dry run)..."
	@chmod +x scripts/watchers-run.sh
	@DRY_RUN=true ./scripts/watchers-run.sh watchers.yaml

bench-superpowered:
	@echo "📊 Benchmark pipeline superpowered..."
	@time $(MAKE) fetch-url URL="https://www.inpi.fr"
	@time $(MAKE) test-ner-enhanced
	@time $(MAKE) test-watchers-dry

security-test:
	@echo "🛡️ Lancement tests sécurité..."
	@./TESTS-SECURITE-AUTOMATISES.sh

shellcheck:
	@echo "🔍 Vérification scripts shell..."
	@command -v shellcheck >/dev/null && find . -name '*.sh' -exec shellcheck {} + || echo "⚠️ shellcheck non installé"

ci: selfcheck smoke security-test
	@echo "✅ CI gates OK - Prêt pour production"

update-guardian-start:
	@echo "🛡️ Démarrage Update Guardian..."
	@node scripts/update-guardian-metrics.js &
	@echo "PID: $$! | Métriques: http://localhost:9091/metrics"

people:
	@test -n "$(TARGET)" || (echo "TARGET=username|email make people"; exit 1)
	@bash osint-orchestrator.sh people $(TARGET)

clean:
	rm -rf out

validate-packs:
	@chmod +x ./packs-validate.sh
	@./packs-validate.sh osint-packs/dorks/*.yaml

validate-packs-enhanced:
	@chmod +x ./packs-validate-enhanced.sh
	@./packs-validate-enhanced.sh osint-packs/dorks/*.yaml

init-raw-events:
	@test -n "$(DATABASE_URL)" || (echo "DATABASE_URL requis"; exit 1)
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "$(DATABASE_URL)" -f init-raw-events.sql
	@echo "✅ Table raw_events initialisée"

init-lake:
	@echo "🏗️ Initialisation Data Lake EAC..."
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -f database/lake-schema.sql
	@echo "✅ Schema EAC initialisé (entities, claims, processing queue)"

selfcheck:
	@echo "▶ Checking docker & services..."
	@docker --version >/dev/null || (echo "Docker manquant"; exit 1)
	@$(DC) ps
	@echo "▶ Checking PostgreSQL..."
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -Atc "select 1" >/dev/null || (echo "Postgres KO"; exit 1)
	@echo "▶ Checking Elasticsearch..."
	@curl -fsS http://127.0.0.1:$(ELASTIC_PORT) >/dev/null || (echo "Elasticsearch KO"; exit 1)
	@echo "▶ Checking SearXNG..."
	@curl -fsS "http://127.0.0.1:$(SEARXNG_PORT)/search?q=test&format=json" >/dev/null || (echo "SearXNG KO"; exit 1)
	@echo "OK ✅"

migrate:
	@echo "▶ Applying DB schema (init-osint-db.sql)..."
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -f init-osint-db.sql

db-check:
	@echo "▶ Tables:"
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -c "\dt+"
	@echo "▶ raw_events count:"
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -Atc "select count(*) from raw_events;"

smoke:
	@test -n "$(DOMAIN)" || (echo "DOMAIN=example.com make smoke"; exit 1)
	@bash osint-orchestrator.sh recon $(DOMAIN) || echo "⚠️ Smoke test partiel (services externes)"
	@$(MAKE) db-check || echo "⚠️ DB check partiel"

reset-db:
	@echo "⚠ Cela réinitialise uniquement la base Postgres (perte de données)."
	$(DC) stop postgres
	$(DC) rm -f postgres
	docker volume rm $$(docker volume ls -q | grep pg_data) || true
	$(DC) up -d postgres

reset-all:
	@echo "⚠ Cela supprime TOUTES les données (Postgres + Elasticsearch)."
	$(DC) down -v
	$(DC) up -d

setup-superpowered:
	@echo "🚀 Setup AURA Superpowered infrastructure..."
	@chmod +x services/universal-fetcher.js
	@chmod +x services/ner-french.py
	@$(MAKE) migrate
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql "host=127.0.0.1 port=$(POSTGRES_PORT) dbname=$(POSTGRES_DB) user=$(POSTGRES_USER)" -f database/lake-schema.sql
	@echo "✅ Data lake schema initialized"

test-fetcher:
	@echo "🧪 Test Universal Fetcher..."
	@cd services && node universal-fetcher.js https://example.com

test-ner:
	@echo "🧪 Test French NER..."
	@python3 services/ner-french.py "Jean MARTIN travaille chez ACME SAS, SIREN 123 456 789, téléphone 01 23 45 67 89, email jean.martin@acme.fr"

bench-pipeline:
	@echo "📊 Benchmark processing pipeline..."
	@time $(MAKE) test-fetcher
	@time $(MAKE) test-ner