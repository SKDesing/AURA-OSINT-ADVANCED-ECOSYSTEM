# AURA Browser v1.0.0 Cutover - Ultra-Concis

## 🧪 Dry-Run End-to-End (RC)

### Préparer RC
```bash
./scripts/release/prepare-release.sh 1.0.0
git add . && git commit -m "chore: prepare v1.0.0-rc.1"
git tag browser-v1.0.0-rc.1
git push origin main && git push origin browser-v1.0.0-rc.1
```

### Vérifier CI
- [ ] **release-electron**: Builds publiés en pre-release
- [ ] **sbom**: SBOMs attachés + attestation OIDC OK
- [ ] **release notes**: Template injecté avec métriques

### Valider Signature + Attestation
```bash
./scripts/release/validate-cosign-attestation.sh browser-v1.0.0-rc.1

# macOS (si disponible)
spctl -a -vv "$(find . -name '*.app' | head -1)" || true

# Windows (si disponible)
signtool verify /pa /v "AURA Browser*.exe" || true
```

### Test Auto-Update (Facultatif)
```bash
# Lancer RC avec kill switch si besoin
AURA_AUTOUPDATE=off ./dist/AURA\ Browser
```

## 🚀 Go-Live v1.0.0 (GA)

### Publier GA
```bash
./scripts/release/prepare-release.sh 1.0.0
git add . && git commit -m "chore: prepare release v1.0.0"
git tag browser-v1.0.0
git push origin main && git push origin browser-v1.0.0
```

### Vérifications GA
- [ ] **Release Notes**: P95/P99/throughput injectés
- [ ] **SBOM**: CycloneDX + SPDX attachés
- [ ] **Attestation**: OIDC validée
- [ ] **Binaires**: Signés (codesign/signtool OK)

### Test Auto-Update v1.0.0 → v1.0.1
```bash
# 1. Publier v1.0.1 (même procédure)
# 2. Ouvrir v1.0.0 → valider prompt MAJ
# 3. Test kill switch: AURA_AUTOUPDATE=off
```

## 🛡️ Branch Protection (Immédiat)

### Required Status Checks
```
bench, gitleaks, dependency-review, analyze, sbom, required-checks
```

### Settings
- [ ] **Commits/Tags signés**: ✅ Required
- [ ] **Linear history**: ✅ Required  
- [ ] **PR approval**: ✅ 1+ required
- [ ] **Conversations**: ✅ Resolved required

## 🚨 Rollback (Si Nécessaire)

### Désactiver Diffusion
```bash
# Option 1: Dépublier release
gh release delete browser-v1.0.1 --yes

# Option 2: Hotfix rapide
./scripts/release/prepare-release.sh 1.0.1-hotfix
```

### Contournement Auto-Update
```bash
# Kill switch client
export AURA_AUTOUPDATE=off

# Canal beta séparé pour tests futurs
git tag browser-v1.0.2-beta.1
```

## 📊 Post-GA (T+24h/T+72h)

### Surveillance
- [ ] **CI Smoke**: P95 ≤ 800ms maintenu
- [ ] **Nightly**: 120k+/min validé
- [ ] **Crash-Free**: >99.5% (Sentry si activé)
- [ ] **Downloads**: Taux de téléchargement
- [ ] **Updates**: Taux de MAJ réussies

### Archivage
- [ ] **SBOMs**: Archivés dans Release
- [ ] **Attestation**: Provenance vérifiable
- [ ] **Benchmarks**: Rapports dans artifacts
- [ ] **Rotation Clés**: Planifiée (90j)

## 🔧 Commandes Utiles

### Validation Globale
```bash
bash scripts/release/dry-run-validation.sh
```

### Validation Attestation
```bash
bash scripts/release/validate-cosign-attestation.sh browser-v1.0.0
```

### Post-Release
```bash
bash scripts/release/post-release-verify.sh 1.0.0
```

### Status Checks
```bash
# Vérifier jobs pour branch protection
gh run list --workflow=benchmarks.yml --limit=1
gh run list --workflow=security.yml --limit=1
gh run list --workflow=codeql.yml --limit=1
```

## ✅ Success Criteria

### RC Validation
- ✅ **CI Green**: Tous workflows passent
- ✅ **SBOM**: Dual format + attestation
- ✅ **Signatures**: Vérifiées localement
- ✅ **Release Notes**: Template injecté

### GA Success
- ✅ **Performance**: SLO respectés (P95 < 800ms)
- ✅ **Security**: CodeQL clean + signatures
- ✅ **Supply Chain**: SBOM + provenance
- ✅ **Auto-Update**: Fonctionnel + kill switch

### Market Leadership
- ✅ **Benchmarks**: >120k/min prouvés
- ✅ **Transparency**: SBOM public
- ✅ **Compliance**: Audit trail complet
- ✅ **Reliability**: 99.9% uptime target

---

**🏆 AURA Browser v1.0.0 - Domination SSI Irréprochable**