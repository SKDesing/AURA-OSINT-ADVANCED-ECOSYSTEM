# 🚀 AURA SMART PUSH

## Usage

```bash
# Exécuter le script
./scripts/git/smart-push.sh

# Ou depuis n'importe où
bash scripts/git/smart-push.sh
```

## Fonctionnalités

✅ **Backup automatique** avant push  
✅ **Détection gros fichiers** (>100MB)  
✅ **Push par modules** (backend, clients, ai...)  
✅ **Retry automatique** (3 tentatives)  
✅ **Gestion conflits** (rebase auto)  
✅ **Nettoyage cache git** pour gros fichiers  

## Sécurité

- Crée une branche backup avant toute opération
- Gestion d'erreurs complète
- Interruption propre (Ctrl+C)
- Logs colorés pour suivi

## En cas de problème

```bash
# Revenir au backup
git checkout backup-YYYYMMDD-HHMMSS

# Forcer un push simple
git push origin main --force-with-lease
```