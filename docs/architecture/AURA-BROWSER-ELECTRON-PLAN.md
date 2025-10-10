# AURA Browser - Plan Electron

**Objectif**: Transformer l'écosystème AURA en navigateur propriétaire avec Electron

## ARCHITECTURE CIBLE

### Structure Electron
```
apps/browser-electron/
├── main/                    # Main process
│   ├── main.ts             # Entry point
│   ├── services/           # Service orchestrator
│   │   ├── api-manager.ts  # Gestion backend API
│   │   ├── redis-manager.ts
│   │   └── health-monitor.ts
│   └── windows/            # Window management
│       ├── main-window.ts
│       └── preload.ts
├── renderer/               # UI (existing GUI)
│   └── index.html         # Point d'entrée UI
├── build/                 # Build config
│   ├── electron-builder.json
│   └── forge.config.js
└── package.json
```

## INTÉGRATION EXISTANT

### Réutilisation Code Actuel
- **GUI**: `scripts/setup/gui-launcher.js` → renderer process
- **Services**: `start-aura.sh` logic → main process orchestration
- **Chromium**: `chromium-launcher.js` → séparé pour OSINT (Puppeteer)
- **API**: Backend existant orchestré par Electron

### Ports & Services
```typescript
// Configuration services
const SERVICES = {
  api: { port: 4011, script: 'backend/server.js' },
  gui: { port: 3000, script: 'scripts/setup/gui-launcher.js' },
  liveTracker: { port: 4003, script: 'live-tracker/server.js' },
  redis: { port: 6379, managed: true }
};
```

## SÉCURITÉ ELECTRON

### Configuration Sécurisée
```typescript
// main-window.ts
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,           // Sécurité
    contextIsolation: true,           // Isolation
    enableRemoteModule: false,        // Pas de remote
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### CSP Strict
```typescript
// CSP pour renderer
const CSP = `
  default-src 'self';
  connect-src 'self' http://localhost:4011 http://localhost:4003;
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
`;
```

## ORCHESTRATION SERVICES

### Service Manager
```typescript
// services/api-manager.ts
export class ServiceManager {
  private services = new Map<string, ChildProcess>();
  
  async startService(name: string, config: ServiceConfig) {
    const process = spawn('node', [config.script], {
      env: { ...process.env, PORT: config.port.toString() }
    });
    
    this.services.set(name, process);
    await this.waitForHealth(config.port);
  }
  
  async stopAll() {
    for (const [name, process] of this.services) {
      process.kill();
    }
  }
}
```

### Health Monitoring
```typescript
// services/health-monitor.ts
export class HealthMonitor {
  async checkServices(): Promise<ServiceStatus[]> {
    return Promise.all([
      this.checkEndpoint('http://localhost:4011/health'),
      this.checkEndpoint('http://localhost:4003/health'),
      this.checkRedis()
    ]);
  }
}
```

## PACKAGING & DISTRIBUTION

### Electron Builder Config
```json
{
  "appId": "com.aura.osint.browser",
  "productName": "AURA Browser",
  "directories": {
    "output": "dist"
  },
  "files": [
    "main/**/*",
    "renderer/**/*",
    "backend/**/*",
    "scripts/**/*",
    "live-tracker/**/*"
  ],
  "mac": {
    "category": "public.app-category.developer-tools"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": "AppImage"
  }
}
```

## SÉPARATION OSINT/UI

### Chromium Dual Usage
```typescript
// OSINT: Puppeteer séparé
const osintBrowser = await puppeteer.launch({
  userDataDir: path.join(app.getPath('userData'), 'osint-profile'),
  headless: true
});

// UI: Electron BrowserWindow
const mainWindow = new BrowserWindow({
  // Configuration UI
});
```

## MIGRATION PLAN

### Phase 1: Structure Electron
- [ ] Créer `apps/browser-electron/`
- [ ] Main process basique
- [ ] Intégration GUI existant
- [ ] Service orchestration

### Phase 2: Services Integration
- [ ] API manager
- [ ] Health monitoring
- [ ] Redis management
- [ ] Error handling

### Phase 3: Packaging
- [ ] Electron builder config
- [ ] Cross-platform builds
- [ ] Auto-updater
- [ ] Code signing

### Phase 4: Production
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Distribution channels
- [ ] Documentation

## AVANTAGES ELECTRON

### Pour AURA
- **Navigateur propriétaire** complet
- **Services intégrés** (API, Redis, Live-tracker)
- **Distribution native** (Windows/macOS/Linux)
- **Auto-update** intégré
- **Sécurité maîtrisée**
- **Offline capable**

### Vs Alternatives
- **Plus robuste** que Chromium headful
- **Plus intégré** que browser externe
- **Plus sécurisé** que GUI web exposé
- **Plus maintenable** que NW.js

## COMPATIBILITÉ EXISTANT

### Code Réutilisé 100%
- Backend API (port 4011)
- GUI launcher (port 3000)
- Live tracker (port 4003)
- Chromium launcher (OSINT séparé)
- Scripts et configs

### Modifications Minimales
- CSP update (ports 4011/4003)
- Service orchestration (main process)
- Build process (Electron)

**RECOMMANDATION**: Electron est la solution optimale pour "AURA Browser" propriétaire avec intégration complète de l'écosystème existant.