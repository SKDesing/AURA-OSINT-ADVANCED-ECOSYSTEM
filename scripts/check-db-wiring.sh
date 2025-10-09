#!/usr/bin/env bash
set -euo pipefail

# Vérifie la connectivité Postgres, Redis et Vector en local dev

POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-aura_admin}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-change_me}"

REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

echo "Checking Postgres (${POSTGRES_HOST}:${POSTGRES_PORT})..."
PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d postgres -c "select 1;" >/dev/null
echo "OK: Postgres reachable"

for db in aura_dev_api aura_dev_tracker aura_dev_grafana; do
  echo "Checking DB exists: $db"
  PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$db';" | grep -q 1 || { echo "MISSING: $db"; exit 1; }
done
echo "OK: required databases exist"

echo "Checking Redis (${REDIS_HOST}:${REDIS_PORT})..."
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" PING | grep -q PONG || { echo "FAIL: Redis not reachable"; exit 1; }
echo "OK: Redis reachable"

echo "All checks passed."