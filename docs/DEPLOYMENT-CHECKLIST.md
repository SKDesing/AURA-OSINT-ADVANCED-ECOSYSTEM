# AURA Browser Deployment Checklist

## 🔐 GitHub Secrets Configuration

### Required Secrets (Settings → Secrets and variables → Actions)
- [ ] **GH_TOKEN**: Automatically provided by GitHub Actions ✅
- [ ] **MAC_CSC_LINK**: Apple Developer certificate (.p12 base64 encoded)
- [ ] **MAC_CSC_KEY_PASSWORD**: Certificate password
- [ ] **APPLE_API_KEY**: Apple API key for notarization (recommended)
- [ ] **APPLE_API_KEY_ID**: Apple API key ID
- [ ] **APPLE_API_ISSUER**: Apple API issuer ID

### Optional Secrets
- [ ] **WIN_CSC_LINK**: Windows code signing certificate
- [ ] **WIN_CSC_KEY_PASSWORD**: Windows certificate password
- [ ] **SENTRY_DSN**: Error tracking (optional)

## 🚀 Release Process

### 1. Pre-Release Verification
```bash
# Test local build
cd apps/browser-electron
pnpm install
pnpm run build
pnpm run dist

# Verify signatures (macOS)
codesign -dv --verbose=4 "dist/mac/AURA Browser.app"
spctl -a -vv "dist/mac/AURA Browser.app"
```

### 2. Create Release
```bash
# Tag and push
git tag browser-v1.0.0
git push origin browser-v1.0.0
```

### 3. Monitor CI
- [ ] Benchmark CI passes (P95 < 800ms)
- [ ] Security gates pass (no secrets, dependencies OK)
- [ ] Cross-platform builds complete
- [ ] Artifacts uploaded to GitHub Releases

## 🛡️ Security Verification

### Electron Security Audit
- [ ] **contextIsolation**: true ✅
- [ ] **nodeIntegration**: false ✅
- [ ] **sandbox**: true ✅
- [ ] **enableRemoteModule**: false ✅
- [ ] **CSP**: Strict policy enforced ✅
- [ ] **Navigation**: Blocked to external sites ✅
- [ ] **Window opening**: Denied ✅

### IPC Security
- [ ] **Allowlist**: Only approved channels ✅
- [ ] **Validation**: Input sanitization ✅
- [ ] **Logging**: All IPC calls logged ✅

## 📊 Performance Validation

### CI Smoke Test
```bash
# Manual verification
RATE_PER_MIN=3000 DURATION_MIN=1 ./scripts/benchmarks/ci-benchmark.sh
```

### Full Benchmark (Nightly)
```bash
# Trigger manually
gh workflow run nightly-benchmark.yml
```

### SLO Targets
- [ ] **Throughput**: >120k records/min
- [ ] **Latency P95**: <800ms
- [ ] **Latency P99**: <2000ms
- [ ] **Uptime**: >99.9%

## 🔍 Manual Testing

### Desktop App
- [ ] Launch without errors
- [ ] Services start automatically
- [ ] UI loads and responds
- [ ] Auto-updater checks for updates
- [ ] Logs written to userData/logs

### Security
- [ ] No external navigation allowed
- [ ] No new windows opened
- [ ] IPC calls validated and logged
- [ ] CSP blocks unauthorized resources

## 📈 Market Proof Points

### Automated Evidence
- [ ] CI benchmark reports in artifacts
- [ ] Nightly performance reports
- [ ] Security scan results
- [ ] Dependency audit logs

### Public Dashboards
- [ ] Performance metrics visible
- [ ] Uptime monitoring active
- [ ] Error rates tracked
- [ ] Update success rates monitored

## ✅ Go-Live Checklist

### Pre-Launch
- [ ] All secrets configured
- [ ] Security audit passed
- [ ] Performance benchmarks validated
- [ ] Documentation updated
- [ ] Support processes ready

### Launch
- [ ] Tag release created
- [ ] CI/CD pipeline successful
- [ ] Signed binaries available
- [ ] Auto-updater functional
- [ ] Monitoring active

### Post-Launch
- [ ] Performance metrics within SLO
- [ ] Error rates acceptable
- [ ] User feedback collected
- [ ] Security monitoring active