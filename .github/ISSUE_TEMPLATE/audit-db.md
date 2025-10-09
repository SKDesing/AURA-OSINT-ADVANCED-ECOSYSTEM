---
name: Audit Cellule DB
about: Audit technique pour la cellule Base de données
title: '[AUDIT] Cellule DB - Base de données'
labels: audit, inventory, db
assignees: ''
---

## 🎯 **Cellule**: DB - Base de données

### **Cible**
Postgres (prioritaire), Redis (si utilisé), tout entrepôt secondaire

### **Livrables attendus**
- [ ] **schema.sql**: DDL complet (tables, index, FK, vues, fonctions)
- [ ] **indexes_report.json**: Liste index + tailles + fragmentation
- [ ] **data-catalog.json**: Tables avec description, volumétrie, PII flags, rétention
- [ ] **connections.env.template**: Variables de connexion (sans secrets)

### **Scripts à exécuter**
```bash
# EXPLAIN ANALYZE de 5 requêtes critiques
# Vacuum/Analyze état (si applicable)
```

### **Seuils de qualité**
- [ ] Index sur artifacts(hash), artifacts(context_hash)
- [ ] Temps SELECT artifacts/:id < 50ms en local sur échantillon

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/DB/`

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