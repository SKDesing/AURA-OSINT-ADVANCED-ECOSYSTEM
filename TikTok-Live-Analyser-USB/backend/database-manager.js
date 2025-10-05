const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class DatabaseManager {
    constructor() {
        this.dbPath = path.join(__dirname, '../evidence/database');
        this.tablesPath = path.join(this.dbPath, 'tables');
        this.logsPath = path.join(__dirname, '../logs/database');
        this.initDatabase();
    }

    async initDatabase() {
        try {
            await fs.mkdir(this.dbPath, { recursive: true });
            await fs.mkdir(this.tablesPath, { recursive: true });
            await fs.mkdir(this.logsPath, { recursive: true });
            
            // Créer les tables par défaut
            await this.createDefaultTables();
        } catch (error) {
            console.error('Erreur initialisation base:', error);
        }
    }

    async createDefaultTables() {
        const defaultTables = {
            profiles: {
                schema: {
                    id: 'string',
                    username: 'string',
                    displayName: 'string',
                    bio: 'text',
                    riskLevel: 'enum:low,medium,high',
                    createdAt: 'datetime',
                    updatedAt: 'datetime',
                    forensicHash: 'string'
                },
                data: []
            },
            sessions: {
                schema: {
                    id: 'string',
                    profileId: 'string',
                    url: 'string',
                    title: 'string',
                    status: 'enum:active,paused,stopped',
                    startTime: 'datetime',
                    endTime: 'datetime',
                    duration: 'integer',
                    viewers: 'integer',
                    commentsCount: 'integer'
                },
                data: []
            },
            comments: {
                schema: {
                    id: 'string',
                    sessionId: 'string',
                    username: 'string',
                    message: 'text',
                    timestamp: 'datetime',
                    flagged: 'boolean',
                    sentiment: 'enum:positive,negative,neutral',
                    riskScore: 'integer'
                },
                data: []
            },
            evidence: {
                schema: {
                    id: 'string',
                    sessionId: 'string',
                    type: 'enum:video,screenshot,audio,document',
                    filename: 'string',
                    filepath: 'string',
                    filesize: 'integer',
                    hash: 'string',
                    createdAt: 'datetime'
                },
                data: []
            },
            logs: {
                schema: {
                    id: 'string',
                    level: 'enum:info,warning,error,critical',
                    action: 'string',
                    details: 'text',
                    userId: 'string',
                    timestamp: 'datetime',
                    ipAddress: 'string'
                },
                data: []
            }
        };

        for (const [tableName, tableData] of Object.entries(defaultTables)) {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            try {
                await fs.access(tablePath);
            } catch {
                await fs.writeFile(tablePath, JSON.stringify(tableData, null, 2));
                console.log(`✅ Table ${tableName} créée`);
            }
        }
    }

    async getTables() {
        try {
            const files = await fs.readdir(this.tablesPath);
            const tables = files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
            
            return { success: true, tables };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTableSchema(tableName) {
        try {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            const content = await fs.readFile(tablePath, 'utf8');
            const table = JSON.parse(content);
            
            return { success: true, schema: table.schema };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTableData(tableName, limit = 100, offset = 0) {
        try {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            const content = await fs.readFile(tablePath, 'utf8');
            const table = JSON.parse(content);
            
            const totalCount = table.data.length;
            const data = table.data.slice(offset, offset + limit);
            
            return { 
                success: true, 
                data, 
                totalCount,
                limit,
                offset
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async insertRecord(tableName, record) {
        try {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            const content = await fs.readFile(tablePath, 'utf8');
            const table = JSON.parse(content);
            
            // Ajouter ID et timestamps
            const newRecord = {
                id: crypto.randomUUID(),
                ...record,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Ajouter hash forensique si c'est un profil
            if (tableName === 'profiles') {
                newRecord.forensicHash = this.generateHash(newRecord);
            }

            table.data.push(newRecord);
            await fs.writeFile(tablePath, JSON.stringify(table, null, 2));
            
            // Log de l'action
            await this.logAction('INSERT', tableName, newRecord.id);
            
            return { success: true, record: newRecord };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateRecord(tableName, recordId, updates) {
        try {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            const content = await fs.readFile(tablePath, 'utf8');
            const table = JSON.parse(content);
            
            const recordIndex = table.data.findIndex(r => r.id === recordId);
            if (recordIndex === -1) {
                return { success: false, error: 'Enregistrement non trouvé' };
            }

            const updatedRecord = {
                ...table.data[recordIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // Mettre à jour hash forensique si nécessaire
            if (tableName === 'profiles') {
                updatedRecord.forensicHash = this.generateHash(updatedRecord);
            }

            table.data[recordIndex] = updatedRecord;
            await fs.writeFile(tablePath, JSON.stringify(table, null, 2));
            
            await this.logAction('UPDATE', tableName, recordId);
            
            return { success: true, record: updatedRecord };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteRecord(tableName, recordId) {
        try {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            const content = await fs.readFile(tablePath, 'utf8');
            const table = JSON.parse(content);
            
            const recordIndex = table.data.findIndex(r => r.id === recordId);
            if (recordIndex === -1) {
                return { success: false, error: 'Enregistrement non trouvé' };
            }

            table.data.splice(recordIndex, 1);
            await fs.writeFile(tablePath, JSON.stringify(table, null, 2));
            
            await this.logAction('DELETE', tableName, recordId);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async searchRecords(tableName, query) {
        try {
            const tablePath = path.join(this.tablesPath, `${tableName}.json`);
            const content = await fs.readFile(tablePath, 'utf8');
            const table = JSON.parse(content);
            
            const results = table.data.filter(record => {
                return Object.values(record).some(value => 
                    String(value).toLowerCase().includes(query.toLowerCase())
                );
            });
            
            return { success: true, results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    generateHash(data) {
        const content = JSON.stringify(data, Object.keys(data).sort());
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    async logAction(action, tableName, recordId) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                action,
                tableName,
                recordId,
                hash: crypto.randomBytes(16).toString('hex')
            };

            const logFile = path.join(this.logsPath, `database_${new Date().toISOString().split('T')[0]}.log`);
            await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('Erreur logging:', error);
        }
    }

    async getStats() {
        try {
            const tables = await this.getTables();
            if (!tables.success) return tables;

            const stats = {};
            for (const tableName of tables.tables) {
                const data = await this.getTableData(tableName);
                stats[tableName] = data.success ? data.totalCount : 0;
            }

            return { success: true, stats };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = DatabaseManager;