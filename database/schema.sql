-- AURA OSINT Database Schema
CREATE DATABASE IF NOT EXISTS aura_osint;

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investigations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes optimisés pour performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_platform ON profiles(platform);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_username_platform ON profiles(username, platform);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_data_gin ON profiles USING GIN(data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_investigations_created_at ON investigations(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_investigations_title_trgm ON investigations USING GIN(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_investigations_data_gin ON investigations USING GIN(data);

-- Extension pour recherche full-text
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;