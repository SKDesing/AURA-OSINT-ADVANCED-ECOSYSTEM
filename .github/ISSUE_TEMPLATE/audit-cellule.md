---
name: Audit Cellule
about: Template pour les audits par cellule technique
title: '[AUDIT] Cellule [CATEGORY] - Inventaire technique'
labels: audit, inventory
assignees: ''
---

## 🎯 **Cellule**: [CATEGORY]

### **Cible**
[Description de ce qui doit être audité]

### **Livrables attendus**
- [ ] **Fichier 1**: `[filename].json` - [Description]
- [ ] **Fichier 2**: `[filename].md` - [Description]
- [ ] **Fichier 3**: `[filename].[ext]` - [Description]

### **Scripts à exécuter**
```bash
# Commandes spécifiques à cette cellule
npm run [command]
node scripts/[script].js
```

### **Seuils de qualité**
- [ ] **Seuil 1**: [Critère mesurable]
- [ ] **Seuil 2**: [Critère mesurable]
- [ ] **Seuil 3**: [Critère mesurable]

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/[CATEGORY]/`

### **Échéancier**
- **T+24h**: Premiers rapports bruts (JSON)
- **T+48h**: Synthèses MD + recommandations
- **T+72h**: Prêt pour convergence

### **Notes**
- Pas de nouveaux frameworks tant que l'audit n'est pas livré
- Toute PR doit inclure un impact quantifié
- Format JSON pour données machine, MD pour résumés humains

---
**Assigné à**: @[username]
**Priorité**: Haute
**Deadline**: [Date T+48h]