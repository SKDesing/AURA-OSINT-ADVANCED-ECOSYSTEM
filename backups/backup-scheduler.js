const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

class BackupScheduler {
    constructor() {
        this.backupDir = path.join(__dirname);
        this.schedule = {
            database: '0 2 * * *',    // Daily at 2 AM
            files: '0 3 * * 0',       // Weekly on Sunday at 3 AM
            logs: '0 1 * * *'         // Daily at 1 AM
        };
        this.retention = {
            daily: 7,
            weekly: 4,
            monthly: 12
        };
        this.startScheduler();
    }

    startScheduler() {
        // Database backup every 6 hours
        setInterval(() => this.backupDatabase(), 6 * 60 * 60 * 1000);
        
        // Files backup daily
        setInterval(() => this.backupFiles(), 24 * 60 * 60 * 1000);
        
        // Logs backup every 12 hours
        setInterval(() => this.backupLogs(), 12 * 60 * 60 * 1000);
        
        // Cleanup old backups daily
        setInterval(() => this.cleanupOldBackups(), 24 * 60 * 60 * 1000);
        
        console.log('🔄 Backup scheduler started');
    }

    async backupDatabase() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `database-${timestamp}.sql`);
        
        const command = `pg_dump -h localhost -U postgres -d aura_forensic > "${backupFile}"`;
        
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Database backup failed:', error);
                    reject(error);
                    return;
                }
                
                this.compressAndHash(backupFile);
                console.log(`✅ Database backup created: ${backupFile}`);
                resolve(backupFile);
            });
        });
    }

    async backupFiles() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `files-${timestamp}.tar.gz`);
        
        const excludes = [
            'node_modules',
            '.git',
            'logs',
            'temp',
            'backups',
            'browser/profiles'
        ].map(dir => `--exclude='${dir}'`).join(' ');
        
        const command = `tar -czf "${backupFile}" ${excludes} -C .. TikTok-Live-Analyser`;
        
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Files backup failed:', error);
                    reject(error);
                    return;
                }
                
                this.generateChecksum(backupFile);
                console.log(`✅ Files backup created: ${backupFile}`);
                resolve(backupFile);
            });
        });
    }

    async backupLogs() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `logs-${timestamp}.tar.gz`);
        const logsDir = path.join(__dirname, '../logs');
        
        if (!fs.existsSync(logsDir)) {
            console.log('⚠️ No logs directory found, skipping logs backup');
            return;
        }
        
        const command = `tar -czf "${backupFile}" -C "${logsDir}" .`;
        
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Logs backup failed:', error);
                    reject(error);
                    return;
                }
                
                this.generateChecksum(backupFile);
                console.log(`✅ Logs backup created: ${backupFile}`);
                resolve(backupFile);
            });
        });
    }

    compressAndHash(filePath) {
        const gzipCommand = `gzip "${filePath}"`;
        exec(gzipCommand, (error) => {
            if (!error) {
                this.generateChecksum(filePath + '.gz');
            }
        });
    }

    generateChecksum(filePath) {
        if (!fs.existsSync(filePath)) return;
        
        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const hex = hashSum.digest('hex');
        
        fs.writeFileSync(filePath + '.sha256', hex);
    }

    cleanupOldBackups() {
        const files = fs.readdirSync(this.backupDir);
        const now = new Date();
        
        files.forEach(file => {
            const filePath = path.join(this.backupDir, file);
            const stats = fs.statSync(filePath);
            const ageInDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);
            
            let shouldDelete = false;
            
            if (file.startsWith('database-') && ageInDays > this.retention.daily) {
                shouldDelete = true;
            } else if (file.startsWith('files-') && ageInDays > this.retention.weekly * 7) {
                shouldDelete = true;
            } else if (file.startsWith('logs-') && ageInDays > this.retention.daily) {
                shouldDelete = true;
            }
            
            if (shouldDelete) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Deleted old backup: ${file}`);
            }
        });
    }

    async createEmergencyBackup() {
        console.log('🚨 Creating emergency backup...');
        
        try {
            await Promise.all([
                this.backupDatabase(),
                this.backupFiles(),
                this.backupLogs()
            ]);
            
            console.log('✅ Emergency backup completed');
            return true;
        } catch (error) {
            console.error('❌ Emergency backup failed:', error);
            return false;
        }
    }

    getBackupStatus() {
        const files = fs.readdirSync(this.backupDir);
        const backups = {
            database: files.filter(f => f.startsWith('database-')).length,
            files: files.filter(f => f.startsWith('files-')).length,
            logs: files.filter(f => f.startsWith('logs-')).length
        };
        
        const latestBackup = files
            .filter(f => f.includes('-'))
            .map(f => ({
                name: f,
                date: fs.statSync(path.join(this.backupDir, f)).mtime
            }))
            .sort((a, b) => b.date - a.date)[0];
        
        return {
            backups,
            latest: latestBackup,
            totalSize: this.calculateTotalSize()
        };
    }

    calculateTotalSize() {
        const files = fs.readdirSync(this.backupDir);
        let totalSize = 0;
        
        files.forEach(file => {
            const filePath = path.join(this.backupDir, file);
            totalSize += fs.statSync(filePath).size;
        });
        
        return Math.round(totalSize / 1024 / 1024) + ' MB';
    }
}

module.exports = new BackupScheduler();