const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ProfileManager {
    constructor() {
        this.profilesDir = path.join(__dirname, '../evidence/profiles');
        this.logsDir = path.join(__dirname, '../logs/system');
        this.ensureDirectories();
    }

    async ensureDirectories() {
        try {
            await fs.mkdir(this.profilesDir, { recursive: true });
            await fs.mkdir(this.logsDir, { recursive: true });
        } catch (error) {
            console.error('Erreur création répertoires:', error);
        }
    }

    async createProfile(profileData) {
        try {
            const profile = {
                id: crypto.randomUUID(),
                ...profileData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                forensicHash: this.generateForensicHash(profileData)
            };

            const filename = `profile_${profile.id}.json`;
            const filepath = path.join(this.profilesDir, filename);
            
            await fs.writeFile(filepath, JSON.stringify(profile, null, 2));
            
            // Log forensique
            await this.logAction('CREATE_PROFILE', {
                profileId: profile.id,
                username: profileData.username,
                timestamp: profile.createdAt
            });

            return { success: true, profile };
        } catch (error) {
            console.error('Erreur création profil:', error);
            return { success: false, error: error.message };
        }
    }

    async getProfiles() {
        try {
            const files = await fs.readdir(this.profilesDir);
            const profiles = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filepath = path.join(this.profilesDir, file);
                    const content = await fs.readFile(filepath, 'utf8');
                    profiles.push(JSON.parse(content));
                }
            }

            return { success: true, profiles };
        } catch (error) {
            console.error('Erreur lecture profils:', error);
            return { success: false, profiles: [] };
        }
    }

    async updateProfile(profileId, updates) {
        try {
            const filename = `profile_${profileId}.json`;
            const filepath = path.join(this.profilesDir, filename);
            
            const content = await fs.readFile(filepath, 'utf8');
            const profile = JSON.parse(content);
            
            const updatedProfile = {
                ...profile,
                ...updates,
                updatedAt: new Date().toISOString(),
                forensicHash: this.generateForensicHash({ ...profile, ...updates })
            };

            await fs.writeFile(filepath, JSON.stringify(updatedProfile, null, 2));
            
            await this.logAction('UPDATE_PROFILE', {
                profileId,
                changes: Object.keys(updates),
                timestamp: updatedProfile.updatedAt
            });

            return { success: true, profile: updatedProfile };
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteProfile(profileId) {
        try {
            const filename = `profile_${profileId}.json`;
            const filepath = path.join(this.profilesDir, filename);
            
            await fs.unlink(filepath);
            
            await this.logAction('DELETE_PROFILE', {
                profileId,
                timestamp: new Date().toISOString()
            });

            return { success: true };
        } catch (error) {
            console.error('Erreur suppression profil:', error);
            return { success: false, error: error.message };
        }
    }

    generateForensicHash(data) {
        const content = JSON.stringify(data, Object.keys(data).sort());
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    async logAction(action, data) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                action,
                data,
                hash: crypto.randomBytes(16).toString('hex')
            };

            const logFile = path.join(this.logsDir, `profiles_${new Date().toISOString().split('T')[0]}.log`);
            await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('Erreur logging:', error);
        }
    }
}

// API Express
function createProfileAPI() {
    const app = express();
    const profileManager = new ProfileManager();

    app.use(express.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    // Créer un profil
    app.post('/api/profiles', async (req, res) => {
        const result = await profileManager.createProfile(req.body);
        res.json(result);
    });

    // Lister les profils
    app.get('/api/profiles', async (req, res) => {
        const result = await profileManager.getProfiles();
        res.json(result);
    });

    // Mettre à jour un profil
    app.put('/api/profiles/:id', async (req, res) => {
        const result = await profileManager.updateProfile(req.params.id, req.body);
        res.json(result);
    });

    // Supprimer un profil
    app.delete('/api/profiles/:id', async (req, res) => {
        const result = await profileManager.deleteProfile(req.params.id);
        res.json(result);
    });

    // Health check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'healthy', service: 'Profile Manager' });
    });

    return app;
}

module.exports = { ProfileManager, createProfileAPI };