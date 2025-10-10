# OSINT Health & Security Report

**Generated**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
**Status**: $([ -f "var/osint/.healthy" ] && echo "✅ HEALTHY" || echo "⚠️ NEEDS ATTENTION")

## Security Headers Check

```bash
curl -I http://localhost:4010/api/osint/tools 2>/dev/null | grep -E "(helmet|csp|hsts|x-frame|x-content)" || echo "❌ Missing security headers"
```

## Vulnerability Scan

```bash
pnpm audit --prod --audit-level moderate 2>/dev/null | tail -5
```

## OSINT Services Status

### Docker Services
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(aura_|NAMES)"
```

### API Endpoints
- GET /api/osint/tools: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:4010/api/osint/tools || echo "FAIL")
- Health: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:4010/health || echo "FAIL")

## Database Status

```sql
SELECT COUNT(*) as total_jobs FROM osint_jobs;
SELECT COUNT(*) as total_results FROM osint_results;
```

## Disk Usage

```bash
du -sh var/osint/ 2>/dev/null || echo "0B"
```

## Action Items

- [ ] Critical vulnerabilities: {CRITICAL_COUNT}
- [ ] High vulnerabilities: {HIGH_COUNT}
- [ ] Security headers: {HEADERS_STATUS}
- [ ] OSINT E2E test: {E2E_STATUS}

