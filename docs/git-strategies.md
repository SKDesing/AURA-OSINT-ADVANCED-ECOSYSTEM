# 🚀 STRATÉGIES PUSH OPTIMISÉES - GUIDE TECHNIQUE

## 📊 **ANALYSE ACTUELLE**
- **Taille repo**: 5.7GB
- **Problème**: Fichiers > 100MB (limite GitHub)
- **Solution**: Stratégies de découpage et optimisation

## 🎯 **STRATÉGIES RECOMMANDÉES**

### **1. PUSH PAR MODULES (RECOMMANDÉ)**
```bash
# Push par dossier logique
git add backend/ && git commit -m "feat: backend core"
git push origin main

git add clients/ && git commit -m "feat: frontend clients"  
git push origin main

git add ai/ && git commit -m "feat: AI ecosystem"
git push origin main
```

### **2. GIT LFS POUR GROS FICHIERS**
```bash
# Installer Git LFS
git lfs install

# Tracker les gros fichiers
git lfs track "*.so*"
git lfs track "*.dylib"
git lfs track "*.gguf"
git lfs track "*.bin"
git lfs track "*.tar.gz"

# Commit et push
git add .gitattributes
git commit -m "feat: add LFS tracking"
git push origin main
```

### **3. .GITIGNORE OPTIMISÉ**
```bash
# Ajouter au .gitignore
node_modules/
*.so*
*.dylib
marketing/sites/*/node_modules/
backup-*.tar.gz
*.map
```

### **4. PUSH INCRÉMENTAL**
```bash
# Vérifier la taille avant push
git diff --stat HEAD~1

# Push par petits commits
git rebase -i HEAD~10  # Squash si nécessaire
git push origin main
```

## ⚡ **OPTIMISATIONS FUTURES**

### **A. STRUCTURE MODULAIRE**
```
AURA-OSINT/
├── core/           # < 50MB
├── modules/        # < 100MB par module  
├── assets/         # LFS tracked
└── docs/           # < 10MB
```

### **B. CI/CD PIPELINE**
```yaml
# .github/workflows/deploy.yml
- name: Check file sizes
  run: find . -size +100M -exec ls -lh {} \;
  
- name: LFS push
  run: git lfs push --all origin main
```

### **C. MONITORING TAILLE**
```bash
# Script de monitoring
#!/bin/bash
echo "🔍 Checking large files..."
find . -type f -size +50M | while read file; do
  echo "⚠️  Large file: $file ($(du -h "$file" | cut -f1))"
done
```

## 🛡️ **BONNES PRATIQUES**

1. **Avant chaque push**:
   ```bash
   git status
   du -sh .
   find . -type f -size +50M
   ```

2. **Commits atomiques**:
   - 1 feature = 1 commit
   - Max 100MB par commit

3. **Branches par feature**:
   ```bash
   git checkout -b feature/aura-front
   # Développement
   git push origin feature/aura-front
   # Merge après review
   ```

## 🚨 **SOLUTIONS D'URGENCE**

### **Si push échoue**:
```bash
# 1. Identifier le problème
git ls-files | xargs ls -la | sort -k5 -rn | head -10

# 2. Supprimer du cache
git rm --cached fichier-volumineux

# 3. Commit et retry
git commit -m "fix: remove large files"
git push origin main
```

### **Reset si nécessaire**:
```bash
# ATTENTION: Perte de données possible
git reset --soft HEAD~1  # Garde les changements
git reset --hard HEAD~1  # Supprime tout
```

## 📈 **MÉTRIQUES DE SUCCÈS**

- ✅ Push < 2 minutes
- ✅ Aucun fichier > 100MB
- ✅ Commits < 50MB
- ✅ LFS pour assets > 10MB

## 🎯 **PROCHAINES ÉTAPES**

1. **Immédiat**: Configurer LFS
2. **Court terme**: Restructurer par modules
3. **Long terme**: Pipeline CI/CD automatisé