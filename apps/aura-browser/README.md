# 🌐 AURA Browser

**Navigateur intégré pour l'écosystème AURA OSINT**

## 🎯 Vue d'ensemble

AURA Browser est l'application Electron qui encapsule toute l'interface AURA dans votre propre navigateur contrôlé, avec orchestration automatique des services backend.

## ⚡ Quick Start

### Développement
```bash
# Depuis la racine du projet
pnpm run dev:browser
```

### Production
```bash
# Build l'interface React
pnpm run build:ui

# Build l'app Electron
pnpm run build:browser

# L'app sera dans apps/aura-browser/dist/
```

## 🏗️ Architecture

- **Process Principal**: Orchestre backend (port 4011) et services
- **Renderer**: Charge l'interface React (dev: localhost:3000, prod: build statique)
- **Preload**: API sécurisée pour health checks
- **Isolation**: Puppeteer OSINT séparé de l'UI

## 🔧 Configuration

### Développement
- Backend: `http://127.0.0.1:4011`
- Frontend: `http://127.0.0.1:3000`
- DevTools: Activés automatiquement

### Production
- Interface: Build React embarqué
- Backend: Spawné automatiquement
- Packaging: Cross-platform (Linux/Windows/macOS)

## 🛡️ Sécurité

- **Context Isolation**: Activé
- **Node Integration**: Désactivé
- **Sandbox**: Activé
- **Preload**: API minimale exposée

## 📦 Distribution

```bash
# Linux AppImage
pnpm run build:browser

# L'app sera dans dist/
./dist/AURA\ Browser-0.1.0.AppImage
```

## 🔗 Intégration

- **OSINT Tools**: Puppeteer séparé (profils isolés)
- **API Backend**: Proxy automatique vers port 4011
- **WebSocket**: Support temps réel
- **Health Monitoring**: Intégré dans l'interface