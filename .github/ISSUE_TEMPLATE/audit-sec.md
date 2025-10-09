---
name: Audit Cellule SEC
about: Audit technique pour la cellule Sécurité/Compliance
title: '[AUDIT] Cellule SEC - Sécurité/Compliance'
labels: audit, inventory, sec
assignees: ''
---

## 🎯 **Cellule**: SEC - Sécurité/Compliance

### **Cible**
Secrets, licences, SBOM, CORS, auth/JWT, logs PII

### **Livrables attendus**
- [ ] **security-audit.json**: Gitleaks result, SBOM (syft), license check, osv/npmaudit, semgrep
- [ ] **policies-hash.json**: Policy/guardrails version + hash, context_hash/decision_hash propagation
- [ ] **cors-auth-report.md**: Origins autorisés, headers, TTL, algos JWT, rotation clés

### **Scripts à exécuter**
```bash
# npm run security:audit
# gitleaks detect --source .
# npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD"
```

### **Seuils de qualité**
- [ ] Zéro secret dans Git, zéro wildcard CORS en prod
- [ ] JWT alg HS256/RS256 explicite

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/SEC/`

### **Échéancier**
- **T+24h**: Premiers rapports bruts (JSON)
- **T+48h**: Synthèses MD + recommandations  
- **T+72h**: Prêt pour convergence

### **Notes importantes**
- ❌ Pas de nouveaux frameworks tant que l'audit n'est pas livré
- ❌ Pas de Docker en dev: orchestration 100% Node via pnpm scripts
- ✅ Toute PR doit inclure un impact quantifié (tokens, latence, accuracy, sécurité)
- ✅ Format JSON pour données machine, MD pour résumés humains

### **Commandes standard**
```bash
npm run audit:full
npm run ports:inventory
npm run security:audit
```

---
**Priorité**: 🔥 Haute  
**Deadline**: T+48h  
**Status**: 📋 À faire