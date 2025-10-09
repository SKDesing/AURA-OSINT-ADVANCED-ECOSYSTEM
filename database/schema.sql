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

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_platform ON profiles(platform);
CREATE INDEX idx_investigations_status ON investigations(status);