const fs = require('fs').promises;
const path = require('path');

class BaseJSONDB {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }

    async readDB() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading DB:', error);
            return {};
        }
    }

    async writeDB(data) {
        try {
            await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing DB:', error);
            return false;
        }
    }

    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async addRecord(tableName, record) {
        const db = await this.readDB();
        if (!db[tableName]) db[tableName] = [];
        
        record.id = record.id || this.generateId(tableName);
        record.created_at = record.created_at || new Date().toISOString();
        
        db[tableName].push(record);
        await this.writeDB(db);
        return record;
    }

    async getRecords(tableName, filter = null, limit = 100) {
        const db = await this.readDB();
        let records = db[tableName] || [];
        
        if (filter) {
            records = records.filter(filter);
        }
        
        return records.slice(0, limit);
    }

    async updateRecord(tableName, id, updates) {
        const db = await this.readDB();
        if (!db[tableName]) return null;
        
        const index = db[tableName].findIndex(r => r.id === id);
        if (index === -1) return null;
        
        db[tableName][index] = { ...db[tableName][index], ...updates, updated_at: new Date().toISOString() };
        await this.writeDB(db);
        return db[tableName][index];
    }

    async deleteRecord(tableName, id) {
        const db = await this.readDB();
        if (!db[tableName]) return false;
        
        const index = db[tableName].findIndex(r => r.id === id);
        if (index === -1) return false;
        
        db[tableName].splice(index, 1);
        await this.writeDB(db);
        return true;
    }
}

module.exports = BaseJSONDB;
