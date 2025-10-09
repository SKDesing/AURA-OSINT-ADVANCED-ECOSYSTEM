#!/bin/bash

# 🚀 AURA SMART PUSH - Script de push intelligent et sécurisé
set -e

# Configuration
MAX_FILE_SIZE="100M"
RETRY_COUNT=3
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Pas dans un repository Git"
        exit 1
    fi
    
    log_success "Prérequis OK"
}

# Créer une sauvegarde
create_backup() {
    log_info "Création de la branche de sauvegarde: $BACKUP_BRANCH"
    git branch "$BACKUP_BRANCH" 2>/dev/null || log_warning "Branche existe déjà"
}

# Détecter les gros fichiers
check_large_files() {
    log_info "Vérification des fichiers volumineux..."
    
    large_files=$(find . -type f -size +$MAX_FILE_SIZE 2>/dev/null | grep -v ".git" || true)
    
    if [ -n "$large_files" ]; then
        log_warning "Fichiers > $MAX_FILE_SIZE détectés:"
        echo "$large_files" | while read -r file; do
            size=$(du -h "$file" 2>/dev/null | cut -f1)
            log_warning "  $file ($size)"
            # Auto-remove from git cache
            git rm --cached "$file" 2>/dev/null || true
        done
    fi
}

# Push intelligent par modules
smart_push() {
    local folders=("backend" "clients" "ai" "docs" "scripts" "security" "monitoring" "tests")
    local pushed_count=0
    
    log_info "Récupération des dernières modifications..."
    git fetch origin main 2>/dev/null || log_warning "Impossible de fetch"
    
    for folder in "${folders[@]}"; do
        if [ ! -d "$folder" ]; then
            continue
        fi
        
        if ! git diff --quiet HEAD -- "$folder/" 2>/dev/null; then
            log_info "🚀 Push du module: $folder"
            
            for attempt in $(seq 1 $RETRY_COUNT); do
                if push_folder "$folder" "$attempt"; then
                    log_success "$folder pushed"
                    ((pushed_count++))
                    break
                else
                    if [ $attempt -eq $RETRY_COUNT ]; then
                        log_error "Échec pour $folder"
                        continue 2
                    else
                        log_warning "Retry $attempt/$RETRY_COUNT pour $folder"
                        sleep 2
                    fi
                fi
            done
        fi
    done
    
    # Push des fichiers restants
    if ! git diff --quiet HEAD 2>/dev/null; then
        log_info "🚀 Push des fichiers restants..."
        git add .
        git commit -m "feat: update remaining files - $(date +%Y%m%d-%H%M%S)"
        git push origin main || {
            git pull --rebase origin main 2>/dev/null
            git push origin main
        }
        ((pushed_count++))
    fi
    
    log_success "Push terminé ! $pushed_count modules pushés"
}

# Push d'un dossier spécifique
push_folder() {
    local folder=$1
    local attempt=$2
    
    git add "$folder/" || return 1
    
    if git diff --cached --quiet; then
        return 0
    fi
    
    git commit -m "feat($folder): update module" || return 1
    
    if git push origin main 2>/dev/null; then
        return 0
    else
        git pull --rebase origin main 2>/dev/null || return 1
        git push origin main || return 1
    fi
}

# Fonction principale
main() {
    echo "🚀 AURA SMART PUSH"
    echo "=================="
    
    check_prerequisites
    create_backup
    check_large_files
    smart_push
    
    echo "=================="
    log_success "🎉 PUSH TERMINÉ !"
    log_info "Backup: $BACKUP_BRANCH"
}

trap 'log_error "Interrompu"; exit 1' INT TERM

main "$@"