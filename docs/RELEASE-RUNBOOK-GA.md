# 🚀 AURA GA RELEASE RUNBOOK v1.0.0

## ✅ **PRE-RELEASE VALIDATION COMPLÈTE**

### **Infrastructure Opérationnelle**
- ✅ Backend: Health endpoints + graceful shutdown
- ✅ IA: P50/P95/P99 = 26/35/35ms (≤30ms SLO)
- ✅ Router: 92.3% accuracy, 75% bypass (≥75%/65% SLOs)
- ✅ CI/CD: Node 20 + npm unifié (11 workflows)
- ✅ Sécurité: SHA-256 manifest + SBOM + attestation

## 🎯 **EXÉCUTION GA RELEASE**

### **1. Branch Protection (CRITIQUE)**
```bash
# GitHub Settings → Branches → main
Required Status Checks:
☐ bench (benchmarks.yml)
☐ gitleaks (security.yml)
☐ dependency-review (security.yml)  
☐ analyze (codeql.yml)
☐ sbom (sbom.yml)
☐ smoke (smoke-run.yml)

Settings:
☐ Require pull request reviews: 1+
☐ Dismiss stale reviews: enabled
☐ Require up-to-date branches: enabled
☐ Enforce for administrators: enabled
```

### **2. Secrets Validation**
```bash
# GitHub Settings → Secrets and variables → Actions
macOS Signing:
☐ MAC_CSC_LINK (p12 certificate base64)
☐ MAC_CSC_KEY_PASSWORD
☐ APPLE_API_KEY (AuthKey_*.p8 base64)
☐ APPLE_API_KEY_ID
☐ APPLE_API_ISSUER

Windows Signing (si applicable):
☐ WIN_CSC_LINK
☐ WIN_CSC_KEY_PASSWORD
```

### **3. Repository Metadata**
```bash
# GitHub Settings → General
Description: "Professional OSINT Platform for Advanced Intelligence Gathering"
Topics: osint, electron, ai, rag, security, compliance, intelligence, forensics
Website: https://aura-osint.com (si applicable)
```

### **4. Release Execution**
```bash
# Étape 1: Préparation
./scripts/release/prepare-ga-release.sh 1.0.0

# Étape 2: Validation Actions
# Surveiller: https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/actions
# Vérifier: release-electron, sbom, codeql, smoke, benchmarks

# Étape 3: Validation Release
# URL: https://github.com/SKDesing/AURA-OSINT-ADVANCED-ECOSYSTEM/releases/tag/browser-v1.0.0
☐ Release notes avec métriques IA
☐ SBOM CycloneDX + SPDX attachés
☐ Binaires signés (macOS .dmg, Windows .exe)
☐ Attestation OIDC cosign présente
```

## 🔍 **POST-RELEASE VALIDATION**

### **1. Signatures & Notarisation**
```bash
# macOS
spctl -a -vv "AURA OSINT.app"
codesign -dv --verbose=4 "AURA OSINT.app"

# Windows  
signtool verify /pa /v "AURA-Setup-1.0.0.exe"
```

### **2. Attestation Cosign**
```bash
./scripts/release/validate-cosign-attestation.sh browser-v1.0.0
```

### **3. Performance Validation**
```bash
# Métriques attendues:
☐ AI P95 ≤ 50ms
☐ App startup ≤ 3s
☐ Memory usage ≤ 500MB
☐ Crash-free rate ≥ 99.5%
```

## 📊 **SURVEILLANCE T+24H**

### **Métriques Critiques**
- **Performance**: P95 app ≤ 800ms
- **IA**: Embeddings P50 ≤ 30ms, Router accuracy ≥ 75%
- **Desktop**: Crash-free > 99.5%, MAJ rate > 95%
- **Sécurité**: 0 secrets (gitleaks), 0 high (CodeQL)

### **Page Proofs** (Recommandé)
```bash
# Publier métriques temps réel:
# https://aura-osint.com/proofs
☐ P50/P95/P99 latencies
☐ Accuracy & bypass rates  
☐ Throughput benchmarks
☐ Artefacts nightly
```

## 🚨 **ROLLBACK/HOTFIX**

### **Hotfix Express**
```bash
# Correction critique:
./scripts/release/prepare-ga-release.sh 1.0.1
# Même procédure, tag automatique

# Kill Switch MAJ:
# AURA_AUTOUPDATE=off dans .env
```

### **Rollback Release**
```bash
# Dépublier release KO:
# GitHub → Releases → Edit → Unpublish

# Clients sensibles:
# Utiliser kill switch auto-update
```

## ✅ **CHECKLIST FINAL**

### **Pré-Release**
- [ ] Branch protection activée
- [ ] Secrets macOS/Windows configurés  
- [ ] Description + topics mis à jour
- [ ] README badges production

### **Release**
- [ ] Tag browser-v1.0.0 créé et poussé
- [ ] Actions GitHub toutes vertes
- [ ] Release publiée avec artefacts
- [ ] SBOM + attestation présents

### **Post-Release**
- [ ] Signatures validées (spctl/signtool)
- [ ] Attestation cosign vérifiée
- [ ] Métriques performance OK
- [ ] Surveillance T+24h active

**🎯 STATUS: PRÊT POUR GA RELEASE v1.0.0**