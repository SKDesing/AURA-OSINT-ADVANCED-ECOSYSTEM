# AURA Browser Release Process

## 🎯 Pre-Release Validation

### 1. Secrets Configuration
Verify GitHub secrets are configured (Settings → Secrets and variables → Actions):
- [ ] **MAC_CSC_LINK**: Apple Developer certificate (.p12 base64)
- [ ] **MAC_CSC_KEY_PASSWORD**: Certificate password
- [ ] **APPLE_API_KEY**: Apple API key for notarization
- [ ] **APPLE_API_KEY_ID**: Apple API key ID
- [ ] **APPLE_API_ISSUER**: Apple API issuer ID
- [ ] **WIN_CSC_LINK**: Windows code signing certificate (optional)
- [ ] **WIN_CSC_KEY_PASSWORD**: Windows certificate password (optional)

### 2. Local Build Test
```bash
cd apps/browser-electron
pnpm install
pnpm run build
pnpm run dist

# Verify signatures
codesign -dv --verbose=4 "dist/mac/AURA Browser.app"  # macOS
spctl -a -vv "dist/mac/AURA Browser.app"              # macOS
signtool verify /pa /v dist/win-unpacked/AURA*.exe   # Windows
```

### 3. Security Audit
- [ ] **Electron Security**: contextIsolation: true, sandbox: true, nodeIntegration: false
- [ ] **CSP**: Strict Content Security Policy enforced
- [ ] **IPC**: Allowlist + validation + logging active
- [ ] **Navigation**: External navigation blocked

### 4. CI/CD Validation
- [ ] **Benchmark CI**: Create test PR, verify P95 ≤ 800ms
- [ ] **Security Gates**: Gitleaks + dependency review passing
- [ ] **CodeQL**: No critical security issues

## 🚀 Release Procedure

### Step 1: Prepare Release
```bash
# Automated preparation
./scripts/release/prepare-release.sh 1.0.0

# Manual review
# - Edit generated RELEASE_NOTES_v1.0.0.md
# - Verify version in apps/browser-electron/package.json
```

### Step 2: Commit and Tag
```bash
git add .
git commit -m "chore: prepare release v1.0.0"
git tag browser-v1.0.0
git push origin main
git push origin browser-v1.0.0
```

### Step 3: Monitor CI/CD
Watch GitHub Actions:
- [ ] **Release Electron**: Cross-platform builds complete
- [ ] **SBOM Generation**: Software Bill of Materials attached
- [ ] **CodeQL**: Security analysis passed
- [ ] **Benchmarks**: Performance validation passed

### Step 4: Verify Release
- [ ] **GitHub Release**: Created with signed binaries
- [ ] **macOS Notarization**: `spctl -a -vv` on downloaded app
- [ ] **Windows Signature**: `signtool verify` on downloaded exe
- [ ] **SBOM**: Attached to release assets

## 🔄 Auto-Update Testing

### Test Update Flow
1. Install v1.0.0 locally
2. Create v1.0.1 (increment version, tag, push)
3. Open v1.0.0 app → wait for update prompt
4. Apply update → verify v1.0.1 running
5. Check logs: `userData/logs/aura-browser.log`

### Update Channels
- **Stable**: Production releases (browser-v*.*.*)
- **Beta**: Pre-release testing (browser-v*.*.*-beta.*)

## 📊 Post-Release Monitoring

### Performance Metrics
- [ ] **CI Benchmarks**: P95 ≤ 800ms maintained
- [ ] **Nightly Full**: 120k+/min throughput validated
- [ ] **Crash-Free Rate**: >99.5% desktop sessions

### Security Monitoring
- [ ] **Dependency Alerts**: No new high-severity issues
- [ ] **CodeQL**: Weekly scans clean
- [ ] **Secrets**: Zero leaks detected

### Compliance Evidence
- [ ] **Audit Trail**: CI artifacts preserved
- [ ] **SBOM**: Supply chain transparency
- [ ] **Provenance**: Build attestation available

## 🚨 Rollback Procedures

### Emergency Rollback
```bash
# Option 1: Delete problematic release
gh release delete browser-v1.0.1 --yes

# Option 2: Publish hotfix
./scripts/release/prepare-release.sh 1.0.2
# Fix issues, commit, tag, push
```

### Client-Side Rollback
- Disable auto-update temporarily: `AURA_AUTOUPDATE=off`
- Provide manual downgrade instructions
- Communicate via release notes

## 📋 Release Checklist Template

### Pre-Release
- [ ] Secrets configured
- [ ] Local build successful
- [ ] Security audit passed
- [ ] CI/CD validation complete

### Release
- [ ] Version updated
- [ ] Release notes generated
- [ ] Tag created and pushed
- [ ] CI/CD pipeline successful

### Post-Release
- [ ] Binaries verified
- [ ] Auto-update tested
- [ ] Monitoring active
- [ ] Documentation updated

### Evidence Pack
- [ ] Performance reports archived
- [ ] Security scan results saved
- [ ] SBOM and provenance available
- [ ] Compliance documentation updated

## 🎯 Success Criteria

### Technical
- ✅ **Build Success**: All platforms build without errors
- ✅ **Security**: Zero critical vulnerabilities
- ✅ **Performance**: SLO targets met (P95 < 800ms)
- ✅ **Signing**: Trusted certificates applied

### Market Proof
- ✅ **Benchmarks**: Public performance validation
- ✅ **Transparency**: SBOM and provenance available
- ✅ **Compliance**: Audit trail complete
- ✅ **Reliability**: Auto-update functional