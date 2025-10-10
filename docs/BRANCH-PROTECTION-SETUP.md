# Branch Protection Setup Guide

## 🛡️ Required Branch Protection Rules

### Main Branch Protection
Navigate to: **Settings → Branches → Add rule**

#### Basic Settings
- **Branch name pattern**: `main`
- **Restrict pushes that create files**: ✅ Enabled
- **Restrict force pushes**: ✅ Enabled
- **Allow deletions**: ❌ Disabled

#### Pull Request Requirements
- **Require a pull request before merging**: ✅ Enabled
  - **Require approvals**: ✅ 1 approval minimum
  - **Dismiss stale PR approvals**: ✅ Enabled
  - **Require review from code owners**: ✅ Enabled
  - **Restrict reviews to users with write access**: ✅ Enabled

#### Status Check Requirements
- **Require status checks to pass**: ✅ Enabled
- **Require branches to be up to date**: ✅ Enabled

**Required Status Checks:**
- `bench` (from benchmarks.yml)
- `gitleaks` (from security.yml)
- `dependency-review` (from security.yml)
- `analyze` (from codeql.yml)
- `sbom` (from sbom.yml)
- `required-checks` (from branch-protection.yml)

#### Additional Restrictions
- **Restrict pushes that create files**: ✅ Enabled
- **Require signed commits**: ✅ Enabled (recommended)
- **Require linear history**: ✅ Enabled
- **Include administrators**: ✅ Enabled

## 🔐 Repository Security Settings

### Security & Analysis
Navigate to: **Settings → Security & analysis**

#### Dependency Graph
- **Dependency graph**: ✅ Enabled
- **Dependabot alerts**: ✅ Enabled
- **Dependabot security updates**: ✅ Enabled

#### Code Scanning
- **CodeQL analysis**: ✅ Enabled (via workflow)
- **Secret scanning**: ✅ Enabled
- **Secret scanning push protection**: ✅ Enabled

#### Private Vulnerability Reporting
- **Private vulnerability reporting**: ✅ Enabled

## 🏷️ Tag Protection Rules

### Release Tags
Navigate to: **Settings → Tags → Add rule**

#### Tag Protection
- **Tag name pattern**: `browser-v*.*.*`
- **Restrict creation**: ✅ Enabled
- **Restrict deletion**: ✅ Enabled
- **Require signed tags**: ✅ Enabled (recommended)

**Allowed to create matching tags:**
- Repository administrators
- Maintain role or above

## 🔑 Environment Protection

### Production Environment
Navigate to: **Settings → Environments → New environment**

#### Environment Name
- **Name**: `production`

#### Protection Rules
- **Required reviewers**: ✅ Enabled
  - Add team/users who can approve production deployments
- **Wait timer**: 5 minutes (optional)
- **Deployment branches**: Selected branches only
  - Add: `main`

#### Environment Secrets
Configure production-specific secrets:
- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`
- `APPLE_API_KEY`
- `APPLE_API_KEY_ID`
- `APPLE_API_ISSUER`
- `WIN_CSC_LINK`
- `WIN_CSC_KEY_PASSWORD`

## 📋 Verification Checklist

### Branch Protection Active
- [ ] Main branch protected
- [ ] Force push disabled
- [ ] PR required with approval
- [ ] Status checks required
- [ ] Linear history enforced
- [ ] Signed commits required

### Security Features
- [ ] Dependabot alerts enabled
- [ ] CodeQL analysis active
- [ ] Secret scanning enabled
- [ ] Push protection active
- [ ] Private vulnerability reporting enabled

### Tag Protection
- [ ] Release tags protected
- [ ] Creation restricted
- [ ] Deletion restricted
- [ ] Signed tags required

### Environment Protection
- [ ] Production environment configured
- [ ] Required reviewers set
- [ ] Deployment branches restricted
- [ ] Environment secrets configured

## 🚨 Emergency Procedures

### Bypass Protection (Emergency Only)
1. **Temporary bypass**: Admin can temporarily disable protection
2. **Emergency hotfix**: Use emergency branch with separate protection rules
3. **Rollback**: Revert to last known good state

### Incident Response
1. **Disable auto-deployment**: Pause release workflows
2. **Security incident**: Enable additional monitoring
3. **Recovery**: Follow documented recovery procedures

## 📊 Monitoring & Compliance

### Regular Audits
- **Weekly**: Review failed status checks
- **Monthly**: Audit branch protection compliance
- **Quarterly**: Review and update protection rules

### Compliance Evidence
- **Audit logs**: GitHub audit log exports
- **Status check history**: CI/CD pipeline results
- **Review records**: PR approval history
- **Security scans**: CodeQL and dependency scan results

## 🔧 Automation Scripts

### Check Protection Status
```bash
# Verify branch protection via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection --jq '.required_status_checks.contexts[]'
```

### Validate Required Checks
```bash
# List recent workflow runs
gh run list --workflow=benchmarks.yml --limit=5
gh run list --workflow=security.yml --limit=5
gh run list --workflow=codeql.yml --limit=5
```

### Monitor Compliance
```bash
# Check for unprotected branches
gh api repos/:owner/:repo/branches --jq '.[] | select(.protected == false) | .name'
```