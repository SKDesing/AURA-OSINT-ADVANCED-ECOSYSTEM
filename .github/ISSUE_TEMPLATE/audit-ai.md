---
name: Audit Cellule AI
about: Audit technique pour la cellule IA/Modèles/Embeddings
title: '[AUDIT] Cellule AI - IA/Modèles/Embeddings'
labels: audit, inventory, ai
assignees: ''
---

## 🎯 **Cellule**: AI - IA/Modèles/Embeddings

### **Cible**
Embeddings locaux Xenova e5-small + tout autre modèle (local/remote)

### **Livrables attendus**
- [ ] **models-inventory.json**: Nom modèle, licence, taille, device, latence p50/p95, dimensions
- [ ] **router-bench.json**: Accuracy, bypass, confusion matrix par classe, seuils retenus
- [ ] **embeddings-cache-report.json**: Nombre vecteurs, taille disque, hit ratio

### **Scripts à exécuter**
```bash
# npm run ai:embeddings:health
# npm run ai:router:bench
```

### **Seuils de qualité**
- [ ] bypass ≥ 0.65, accuracy ≥ 0.75
- [ ] p50 embed ≤ 30ms en local

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/AI/`

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