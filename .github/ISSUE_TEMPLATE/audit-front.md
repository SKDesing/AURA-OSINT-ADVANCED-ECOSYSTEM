---
name: Audit Cellule FRONT
about: Audit technique pour la cellule Front/UX/Design System
title: '[AUDIT] Cellule FRONT - Front/UX/Design System'
labels: audit, inventory, front
assignees: ''
---

## 🎯 **Cellule**: FRONT - Front/UX/Design System

### **Cible**
clients/web-react/ (ou apps/web), Observability, Router, Artifact Viewer

### **Livrables attendus**
- [ ] **ui-inventory.md**: Liste composants DS (atoms→organisms), tokens, thèmes, a11y checks
- [ ] **telemetry-config.md**: Sentry dev désactivé, wrapper notify (SweetAlert2 + toasts), event bus UI
- [ ] **api-client-report.json**: Endpoints consommés, schémas Zod utilisés, gestion erreurs

### **Scripts à exécuter**
```bash
# Bundle analysis et performance audit
```

### **Seuils de qualité**
- [ ] FCP < 1.5s (intranet), bundle initial < 300KB hors charts
- [ ] A11y: focus visible, aria des modales, contrastes AA

### **Dépôt des livrables**
📁 **Dossier**: `reports/audit/FRONT/`

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