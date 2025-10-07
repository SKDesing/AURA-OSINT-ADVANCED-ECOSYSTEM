#!/usr/bin/env node
// AURA Security Manager - Gestion sécurisée des données sensibles

const fs = require('fs');
const { spawn, execSync } = require('child_process');
const crypto = require('crypto');

class SecurityManager {
    constructor() {
        this.encryptedFiles = new Set();
        this.loadEncryptedFilesList();
    }

    // Vérifier statut chiffrement
    checkEncryptionStatus() {
        try {
            const status = execSync('git-crypt status', { encoding: 'utf8' });
            const encrypted = status.split('\n').filter(line => line.includes('encrypted'));
            
            return {
                enabled: true,
                encryptedFiles: encrypted.length,
                status: encrypted
            };
        } catch (error) {
            return { enabled: false, error: error.message };
        }
    }

    // Chiffrer fichier spécifique
    encryptFile(filePath) {
        try {
            // Ajouter à .gitattributes si pas déjà présent
            const gitattributes = fs.readFileSync('.gitattributes', 'utf8');
            const rule = `${filePath} filter=git-crypt diff=git-crypt`;
            
            if (!gitattributes.includes(rule)) {
                fs.appendFileSync('.gitattributes', `\n${rule}`);
            }
            
            execSync(`git add ${filePath} .gitattributes`);
            return { success: true, message: `${filePath} sera chiffré au prochain commit` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Générer rapport sécurité
    generateSecurityReport() {
        const encryption = this.checkEncryptionStatus();
        const sensitiveFiles = this.scanSensitiveFiles();
        
        return {
            timestamp: new Date().toISOString(),
            encryption,
            sensitiveFiles,
            recommendations: this.getSecurityRecommendations(sensitiveFiles)
        };
    }

    // Scanner fichiers sensibles non chiffrés
    scanSensitiveFiles() {
        const sensitivePatterns = [
            /\.key$/,
            /\.pem$/,
            /\.env/,
            /password/i,
            /secret/i,
            /credential/i,
            /token/i
        ];

        const allFiles = execSync('find . -type f -not -path "./.git/*"', { encoding: 'utf8' })
            .split('\n').filter(f => f);

        const sensitive = allFiles.filter(file => 
            sensitivePatterns.some(pattern => pattern.test(file))
        );

        return {
            total: sensitive.length,
            files: sensitive,
            encrypted: sensitive.filter(f => this.isFileEncrypted(f)).length
        };
    }

    isFileEncrypted(filePath) {
        try {
            const status = execSync(`git-crypt status ${filePath}`, { encoding: 'utf8' });
            return status.includes('encrypted');
        } catch {
            return false;
        }
    }

    getSecurityRecommendations(sensitiveFiles) {
        const recommendations = [];
        
        if (!this.checkEncryptionStatus().enabled) {
            recommendations.push("Activer git-crypt: ./security-setup.sh");
        }
        
        if (sensitiveFiles.total > sensitiveFiles.encrypted) {
            recommendations.push(`${sensitiveFiles.total - sensitiveFiles.encrypted} fichiers sensibles non chiffrés`);
        }
        
        return recommendations;
    }

    loadEncryptedFilesList() {
        try {
            const gitattributes = fs.readFileSync('.gitattributes', 'utf8');
            const lines = gitattributes.split('\n');
            
            lines.forEach(line => {
                if (line.includes('filter=git-crypt')) {
                    const file = line.split(' ')[0];
                    this.encryptedFiles.add(file);
                }
            });
        } catch (error) {
            // .gitattributes n'existe pas encore
        }
    }
}

// CLI Interface
if (require.main === module) {
    const manager = new SecurityManager();
    const command = process.argv[2];
    
    switch (command) {
        case 'status':
            console.log(JSON.stringify(manager.checkEncryptionStatus(), null, 2));
            break;
        case 'report':
            console.log(JSON.stringify(manager.generateSecurityReport(), null, 2));
            break;
        case 'encrypt':
            const file = process.argv[3];
            if (file) {
                console.log(JSON.stringify(manager.encryptFile(file), null, 2));
            } else {
                console.log('Usage: node security-manager.js encrypt <file>');
            }
            break;
        default:
            console.log('Usage: node security-manager.js [status|report|encrypt <file>]');
    }
}

module.exports = SecurityManager;