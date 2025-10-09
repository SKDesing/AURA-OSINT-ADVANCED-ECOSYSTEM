---
name: Audit Cellule ORCH
about: Audit technique pour la cellule Orchestrator/CLI/Jobs
title: '[AUDIT] Cellule ORCH - Orchestrator/CLI/Jobs'
labels: audit, inventory, orch
assignees: ''
---

## 🎯 **Cellule**: ORCH - Orchestrator/CLI/Jobs

### **Cible**
scripts/analysis/*, scripts/ai/*, scripts/run/*, service-orchestrator.js

### **Livrables attendus**
- [ ] **jobs-catalog.json**: ID, description, entrée/sortie, durée p50/p95, dépendances
- [ ] **artifacts-spec.json**: BuildArtifact: pipeline steps complet
- [ ] **sse-channels.json**: Liste des canaux SSE émis et payload schemas

### **Scripts à exécuter**
```bash
# Dry-run de 3 tâches: obsolete-scan, registry-diff, build-artifact (10 docs)
```

### **Seuils de qualité**
- [ ] build_ms p50 ≤ 120ms/doc (sur échantillon local)

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/ORCH/`

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