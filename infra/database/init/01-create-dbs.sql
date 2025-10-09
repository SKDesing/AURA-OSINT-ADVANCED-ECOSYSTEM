-- CRÉATION DES BASES PAR SERVICE
CREATE DATABASE aura_dev_api;
CREATE DATABASE aura_dev_tracker;
CREATE DATABASE aura_dev_grafana;

-- RÔLES (mots de passe placeholders, à modifier hors Git)
CREATE ROLE aura_rw_api LOGIN PASSWORD 'CHANGE_ME';
CREATE ROLE aura_ro_api LOGIN PASSWORD 'CHANGE_ME';
CREATE ROLE aura_rw_tracker LOGIN PASSWORD 'CHANGE_ME';
CREATE ROLE aura_ro_tracker LOGIN PASSWORD 'CHANGE_ME';
CREATE ROLE aura_rw_grafana LOGIN PASSWORD 'CHANGE_ME';

-- Extensions dans aura_dev_api
\connect aura_dev_api
CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS embeddings AUTHORIZATION aura_rw_api;
GRANT USAGE ON SCHEMA public, embeddings TO aura_ro_api;
GRANT ALL PRIVILEGES ON SCHEMA public, embeddings TO aura_rw_api;

-- Extensions dans aura_dev_tracker (Timescale)
\connect aura_dev_tracker
CREATE EXTENSION IF NOT EXISTS timescaledb;
GRANT ALL PRIVILEGES ON SCHEMA public TO aura_rw_tracker;
GRANT USAGE ON SCHEMA public TO aura_ro_tracker;

-- Grafana
\connect aura_dev_grafana
GRANT ALL PRIVILEGES ON DATABASE aura_dev_grafana TO aura_rw_grafana;