---
name: Audit Cellule API
about: Audit technique pour la cellule Backend/Gateway/API
title: '[AUDIT] Cellule API - Backend/Gateway/API'
labels: audit, inventory, api
assignees: ''
---

## 🎯 **Cellule**: API - Backend/Gateway/API

### **Cible**
ai/gateway/, backend/, middleware/, endpoints MVP 4010

### **Livrables attendus**
- [ ] **openapi.json**: Swagger NestJS actualisé
- [ ] **endpoints-inventory.md**: Routes, méthodes, auth (RBAC), timeouts, codes d'erreur, samples
- [ ] **sse-behavior.md**: Keepalive, retry, formats, backoff conseillé au front

### **Scripts à exécuter**
```bash
# Contrats Zod côté front alignés avec OpenAPI (diff)
```

### **Seuils de qualité**
- [ ] p95 /ai/observability/summary < 150ms en local
- [ ] /ai/stream/metrics stable > 10min sans leak

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/API/`

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