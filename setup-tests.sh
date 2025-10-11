#!/bin/bash

echo "📦 Installation des outils de test pour AURA OSINT Frontend"
echo "═══════════════════════════════════════════════════════════"

# Créer le dossier de tests
mkdir -p frontend/tests/{unit,integration,e2e,performance}

# Aller dans le dossier frontend
cd frontend

# Initialiser package.json si nécessaire
if [ ! -f "package.json" ]; then
  npm init -y
fi

# Installer les outils de test
echo "📥 Installation Jest, Puppeteer, Testing Library..."
npm install --save-dev \
  jest \
  @testing-library/dom \
  @testing-library/jest-dom \
  puppeteer \
  jest-puppeteer \
  @playwright/test

echo "✅ Outils de test installés!"

# Créer la configuration Jest
cat > jest.config.js << 'JESTCONFIG'
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ]
};
JESTCONFIG

# Créer le fichier de setup
cat > tests/setup.js << 'SETUP'
require('@testing-library/jest-dom');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock WebSocket
global.WebSocket = jest.fn(() => ({
  addEventListener: jest.fn(),
  send: jest.fn(),
  close: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();
SETUP

echo "✅ Configuration Jest créée!"
cd ..