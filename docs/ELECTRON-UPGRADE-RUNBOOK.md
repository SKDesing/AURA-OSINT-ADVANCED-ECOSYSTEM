# Electron Upgrade Runbook - Sans Pitié

## 🎯 Objectif
Upgrade Electron 28.0.0 → 38.2.2 pour mitiger CVE ASAR integrity bypass

## ⚡ Commandes d'Installation

```bash
cd apps/browser-electron
npm install electron@38.2.2 --save-exact
npm run build
```

## 🧪 Tests de Validation

### 1. Démarrage Multi-OS
```bash
# macOS
npm run dev
# Vérifier: fenêtre s'ouvre, services démarrent

# Windows (via VM/CI)
npm run dev
# Vérifier: pas d'erreur Windows-specific

# Linux
npm run dev
# Vérifier: AppImage/deb packaging OK
```

### 2. IPC/Preload Integrity
```bash
# Test contextIsolation
node -e "console.log(require('./main/windows/preload.js'))"

# Test sandbox
# Vérifier dans DevTools: window.electronAPI défini, pas window.require
```

### 3. ASAR Integrity Check
```bash
# Test avec hash valide
AURA_APP_ASAR_SHA256=abc123 npm run dev
# Doit: démarrer normalement

# Test avec hash invalide
AURA_APP_ASAR_SHA256=invalid npm run dev
# Doit: exit(1) avec erreur "INTEGRITY BREACH"
```

### 4. Packaging Cross-Platform
```bash
# macOS DMG
npm run dist -- --mac
# Vérifier: notarisation OK, signature valide

# Windows NSIS
npm run dist -- --win
# Vérifier: signtool signature OK

# Linux AppImage
npm run dist -- --linux
# Vérifier: exécution offline OK
```

## 🔒 Points de Sécurité

### Code Signing Validation
```bash
# macOS
spctl -a -vvv dist/AURA\ Browser.app
# Doit: "accepted"

# Windows
signtool verify /pa dist/AURA\ Browser\ Setup.exe
# Doit: "Successfully verified"
```

### Permissions Check
```bash
# Vérifier install dir non-writable par user
ls -la /Applications/AURA\ Browser.app
# Doit: root:admin ou system ownership
```

## 🚨 Rollback Plan

Si échec critique:
```bash
git checkout main
cd apps/browser-electron
npm install electron@28.0.0 --save-exact
npm run build
```

## ✅ Critères de Succès

- [ ] Démarrage OK sur macOS/Windows/Linux
- [ ] IPC/preload fonctionnels (contextIsolation=true)
- [ ] ASAR integrity check actif
- [ ] Packaging cross-platform OK
- [ ] Code signing valide
- [ ] Auto-update compatible
- [ ] Performance ≤ baseline (temps démarrage)

## 📊 Métriques Post-Upgrade

```bash
# Temps de démarrage
time npm run dev

# Taille binaire
du -h dist/

# Memory footprint
ps aux | grep electron
```

**Baseline Electron 28**: ~150MB RAM, ~3s startup
**Target Electron 38**: ≤ 200MB RAM, ≤ 4s startup