---
name: Audit Cellule DEVOPS
about: Audit technique pour la cellule DevOps/Runtime
title: '[AUDIT] Cellule DEVOPS - DevOps/Runtime'
labels: audit, inventory, devops
assignees: ''
---

## 🎯 **Cellule**: DEVOPS - DevOps/Runtime

### **Cible**
Ports, scripts de lancement pnpm, healthchecks

### **Livrables attendus**
- [ ] **ports-state.json**: Résultat de scripts/dev/port-inventory.js
- [ ] **runbook.md**: Démarrage local coordonné (Front 54112, Back 4010, Gateway 4001), commandes pnpm
- [ ] **ci-pipelines.md**: Gates obligatoires (lint, typecheck, tests, security scans)

### **Scripts à exécuter**
```bash
# npm run ports:inventory
# npm run mvp:dev (test de démarrage)
```

### **Seuils de qualité**
- [ ] Aucun conflit de ports (ports:inventory clean)
- [ ] Scripts reproducibles

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/DEVOPS/`

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