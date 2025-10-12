# 🚨 FICHIERS VOLUMINEUX VERSIONNÉS DANS GIT

**Date**: 2025-01-12  
**Taille totale**: ~9GB  
**Status**: ⚠️ **CRITIQUE**

---

## 🔴 FICHIERS CRITIQUES (>100MB)

### 1. Modèles IA (5.3GB) ⚠️ ÉNORME
```
5.1GB   ai/local-llm/models/qwen2-7b-instruct-q5_k_m.gguf
178MB   ai/local-llm/models/qwen2-1_5b-instruct-q4_k_m.gguf
```
**Problème**: Modèles IA ne doivent JAMAIS être versionnés  
**Impact**: 5.3GB sur chaque clone

### 2. Runtime llama.cpp (404MB) ⚠️
```
404MB   ai/local-llm/runtime/llama.cpp (sous-module Git)
175MB   ai/local-llm/runtime/llama.cpp/.git
132MB   ai/local-llm/runtime/llama.cpp/build
```
**Problème**: Sous-module Git mal configuré + binaires compilés  
**Impact**: 404MB inutiles

### 3. Tools Sherlock (20MB)
```
20MB    tools/sherlock (sous-module Git)
19MB    tools/sherlock/.git
```
**Problème**: Sous-module Git au lieu de dépendance  
**Impact**: 20MB + historique Git

---

## 🟡 FICHIERS MOYENS (10-100MB)

### Node.js Dependencies (2.9GB) ⚠️
```
2.9GB   node_modules/
```
**Problème**: node_modules/ encore partiellement versionné  
**Impact**: 2.9GB sur chaque clone

### Python Virtual Env (582MB) ⚠️
```
582MB   venv-osint/
```
**Problème**: venv-osint/ encore partiellement versionné  
**Impact**: 582MB inutiles

### BFG Tool (14MB)
```
14MB    bfg-1.14.0.jar
```
**Problème**: Outil de nettoyage Git versionné  
**Impact**: 14MB inutiles

---

## 📊 RÉPARTITION PAR CATÉGORIE

| Catégorie | Taille | Fichiers | Doit être versionné? |
|-----------|--------|----------|----------------------|
| **Modèles IA** | 5.3GB | 2 | ❌ NON |
| **node_modules/** | 2.9GB | ~50k | ❌ NON |
| **venv-osint/** | 582MB | ~5k | ❌ NON |
| **llama.cpp runtime** | 404MB | 1 | ❌ NON (submodule) |
| **Sous-modules Git** | 20MB | 1 | ⚠️ Dépendance |
| **Outils** | 14MB | 1 | ❌ NON |
| **TOTAL** | **~9GB** | | |

---

## 🎯 ACTIONS REQUISES

### 🔴 URGENT - Supprimer modèles IA

```bash
# 1. Supprimer du versioning
git rm --cached ai/local-llm/models/*.gguf

# 2. Ajouter au .gitignore
echo "ai/local-llm/models/*.gguf" >> .gitignore

# 3. Commit
git commit -m "🔥 Remove: Modèles IA (5.3GB) du versioning"

# 4. Nettoyage historique (OPTIONNEL - DANGEREUX)
git filter-repo --path ai/local-llm/models/ --invert-paths
```

**Gain**: -5.3GB (-91%)

### 🔴 URGENT - Supprimer node_modules/venv-osint

```bash
# Vérifier qu'ils sont dans .gitignore
grep -E "node_modules|venv-osint" .gitignore

# Si pas déjà fait par Phase 1
git rm -r --cached node_modules/ venv-osint/
git commit -m "🔥 Remove: node_modules + venv-osint du versioning"
```

**Gain**: -3.5GB

### 🟡 IMPORTANT - Configurer sous-modules

```bash
# Supprimer llama.cpp mal configuré
git rm --cached ai/local-llm/runtime/llama.cpp
rm -rf ai/local-llm/runtime/llama.cpp

# Ajouter comme vrai sous-module
git submodule add https://github.com/ggerganov/llama.cpp.git ai/local-llm/runtime/llama.cpp

# Ou installer via package manager
# npm install llama.cpp
```

**Gain**: -404MB

### 🟢 OPTIONNEL - Supprimer BFG

```bash
git rm bfg-1.14.0.jar
git commit -m "🔥 Remove: BFG tool du versioning"
```

**Gain**: -14MB

---

## 📋 .gitignore À COMPLÉTER

```bash
# Modèles IA
ai/local-llm/models/*.gguf
ai/local-llm/models/*.bin
ai/local-llm/models/*.safetensors

# Builds
ai/local-llm/runtime/llama.cpp/build/
**/build/
**/dist/

# Outils
*.jar
bfg-*.jar

# Sous-modules Git
tools/sherlock/.git/
```

---

## 🚀 SCRIPT DE NETTOYAGE COMPLET

```bash
#!/bin/bash
# NETTOYAGE-FICHIERS-VOLUMINEUX.sh

echo "🔥 SUPPRESSION FICHIERS VOLUMINEUX"
echo "==================================="

# 1. Modèles IA
git rm --cached ai/local-llm/models/*.gguf
echo "ai/local-llm/models/*.gguf" >> .gitignore

# 2. Runtime builds
git rm -r --cached ai/local-llm/runtime/llama.cpp/build/

# 3. BFG
git rm --cached bfg-1.14.0.jar

# 4. Commit
git add .gitignore
git commit -m "🔥 Remove: Fichiers volumineux (5.7GB) du versioning

- Modèles IA: 5.3GB
- Runtime builds: 400MB
- Outils: 14MB"

echo "✅ Fichiers supprimés du versioning"
echo "⚠️  Pour nettoyer l'historique: git gc --aggressive"
```

---

## 📊 GAINS ATTENDUS

| Action | Gain | Nouveau Total |
|--------|------|---------------|
| État actuel | - | 9GB |
| Supprimer modèles IA | -5.3GB | 3.7GB |
| Supprimer node_modules | -2.9GB | 800MB |
| Supprimer venv-osint | -582MB | 218MB |
| Supprimer llama.cpp build | -400MB | ~200MB |
| **TOTAL** | **-9GB** | **~200MB** ✅ |

---

## 🏆 CONCLUSION

**Problème**: 9GB de fichiers ne devant PAS être versionnés

**Cause**: 
- Modèles IA commitées (5.3GB)
- node_modules/ partiellement versionné (2.9GB)
- venv-osint/ partiellement versionné (582MB)
- Sous-modules mal configurés (404MB)

**Solution**: Exécuter le script de nettoyage

**Gain potentiel**: -9GB → Repository ~200MB ✅

---

**⚠️ ATTENTION**: Le nettoyage de l'historique Git nécessite `git filter-repo` et un force push.
