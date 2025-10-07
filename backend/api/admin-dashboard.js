// AURA Admin Dashboard - Interface complète de gestion
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');

// Configuration des connexions aux 3 bases
const dbUsers = new Pool({
    user: 'soufiane',
    password: 'Mohand/06',
    host: 'localhost',
    database: 'aura_users',
    port: 5432,
});

const dbForensic = new Pool({
    user: 'soufiane',
    password: 'Mohand/06',
    host: 'localhost',
    database: 'aura_forensic',
    port: 5432,
});

const dbSystem = new Pool({
    user: 'soufiane',
    password: 'Mohand/06',
    host: 'localhost',
    database: 'aura_system',
    port: 5432,
});

class AdminDashboard {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static('public'));
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
    }

    setupRoutes() {
        // Dashboard principal
        this.app.get('/admin', this.renderDashboard.bind(this));
        
        // API Utilisateurs
        this.app.get('/admin/api/users', this.getUsers.bind(this));
        this.app.post('/admin/api/users', this.createUser.bind(this));
        this.app.put('/admin/api/users/:id', this.updateUser.bind(this));
        this.app.delete('/admin/api/users/:id', this.deleteUser.bind(this));
        
        // API Profils TikTok
        this.app.get('/admin/api/profiles', this.getProfiles.bind(this));
        this.app.post('/admin/api/profiles', this.createProfile.bind(this));
        this.app.put('/admin/api/profiles/:id', this.updateProfile.bind(this));
        this.app.delete('/admin/api/profiles/:id', this.deleteProfile.bind(this));
        
        // API Système
        this.app.get('/admin/api/stats', this.getSystemStats.bind(this));
        this.app.get('/admin/api/logs', this.getLogs.bind(this));
        this.app.get('/admin/api/config', this.getConfig.bind(this));
        this.app.put('/admin/api/config/:key', this.updateConfig.bind(this));
        
        // API Investigations
        this.app.get('/admin/api/investigations', this.getInvestigations.bind(this));
        this.app.post('/admin/api/investigations', this.createInvestigation.bind(this));
        this.app.put('/admin/api/investigations/:id', this.updateInvestigation.bind(this));
    }

    async renderDashboard(req, res) {
        try {
            const stats = await this.getSystemStats();
            res.render('admin-dashboard', { stats });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Gestion Utilisateurs
    async getUsers(req, res) {
        try {
            const result = await dbUsers.query(`
                SELECT id_utilisateur, nom_utilisateur, email, nom_complet, 
                       role, statut, derniere_connexion, created_at
                FROM utilisateurs_app 
                ORDER BY created_at DESC
            `);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const { nom_utilisateur, email, mot_de_passe, nom_complet, role } = req.body;
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            
            const result = await dbUsers.query(`
                INSERT INTO utilisateurs_app (nom_utilisateur, email, mot_de_passe_hash, nom_complet, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_utilisateur, nom_utilisateur, email, nom_complet, role
            `, [nom_utilisateur, email, hashedPassword, nom_complet, role]);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { nom_utilisateur, email, nom_complet, role, statut } = req.body;
            
            const result = await dbUsers.query(`
                UPDATE utilisateurs_app 
                SET nom_utilisateur = $1, email = $2, nom_complet = $3, role = $4, statut = $5
                WHERE id_utilisateur = $6
                RETURNING *
            `, [nom_utilisateur, email, nom_complet, role, statut, id]);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await dbUsers.query('DELETE FROM utilisateurs_app WHERE id_utilisateur = $1', [id]);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Gestion Profils TikTok
    async getProfiles(req, res) {
        try {
            const result = await dbForensic.query(`
                SELECT id_utilisateur, pseudo_tiktok, nom_complet, nombre_abonnes,
                       nombre_publications, verification_compte, date_premiere_collecte
                FROM utilisateurs_tiktok 
                ORDER BY date_premiere_collecte DESC
                LIMIT 100
            `);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProfile(req, res) {
        try {
            const {
                pseudo_tiktok, nom_complet, prenom, nom_famille, telephone, email,
                ville, pays, nombre_abonnes, nombre_suivis, nombre_publications,
                bio_description, type_compte
            } = req.body;
            
            const result = await dbForensic.query(`
                INSERT INTO utilisateurs_tiktok (
                    pseudo_tiktok, nom_complet, prenom, nom_famille, telephone, email,
                    ville, pays, nombre_abonnes, nombre_suivis, nombre_publications,
                    bio_description, type_compte
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING *
            `, [pseudo_tiktok, nom_complet, prenom, nom_famille, telephone, email,
                ville, pays, nombre_abonnes, nombre_suivis, nombre_publications,
                bio_description, type_compte]);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const fields = req.body;
            
            const setClause = Object.keys(fields).map((key, index) => `${key} = $${index + 1}`).join(', ');
            const values = Object.values(fields);
            values.push(id);
            
            const result = await dbForensic.query(`
                UPDATE utilisateurs_tiktok SET ${setClause} WHERE id_utilisateur = $${values.length}
                RETURNING *
            `, values);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProfile(req, res) {
        try {
            const { id } = req.params;
            await dbForensic.query('DELETE FROM utilisateurs_tiktok WHERE id_utilisateur = $1', [id]);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Statistiques système
    async getSystemStats(req, res) {
        try {
            const [usersCount, profilesCount, investigationsCount, logsCount] = await Promise.all([
                dbUsers.query('SELECT COUNT(*) FROM utilisateurs_app'),
                dbForensic.query('SELECT COUNT(*) FROM utilisateurs_tiktok'),
                dbForensic.query('SELECT COUNT(*) FROM investigations'),
                dbSystem.query('SELECT COUNT(*) FROM logs_systeme WHERE timestamp_log > NOW() - INTERVAL \'24 hours\'')
            ]);

            const stats = {
                users: parseInt(usersCount.rows[0].count),
                profiles: parseInt(profilesCount.rows[0].count),
                investigations: parseInt(investigationsCount.rows[0].count),
                logs_24h: parseInt(logsCount.rows[0].count)
            };

            if (res) {
                res.json(stats);
            } else {
                return stats;
            }
        } catch (error) {
            if (res) {
                res.status(500).json({ error: error.message });
            } else {
                throw error;
            }
        }
    }

    // Logs système
    async getLogs(req, res) {
        try {
            const { limit = 50, niveau } = req.query;
            let query = 'SELECT * FROM logs_systeme';
            let params = [];
            
            if (niveau) {
                query += ' WHERE niveau = $1';
                params.push(niveau);
            }
            
            query += ` ORDER BY timestamp_log DESC LIMIT $${params.length + 1}`;
            params.push(limit);
            
            const result = await dbSystem.query(query, params);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Configuration système
    async getConfig(req, res) {
        try {
            const result = await dbSystem.query('SELECT * FROM configurations ORDER BY cle_config');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateConfig(req, res) {
        try {
            const { key } = req.params;
            const { valeur_config } = req.body;
            
            const result = await dbSystem.query(`
                UPDATE configurations SET valeur_config = $1 WHERE cle_config = $2
                RETURNING *
            `, [valeur_config, key]);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Investigations
    async getInvestigations(req, res) {
        try {
            const result = await dbForensic.query(`
                SELECT i.*, COUNT(iu.id_utilisateur) as nb_utilisateurs
                FROM investigations i
                LEFT JOIN investigation_utilisateurs iu ON i.id_investigation = iu.id_investigation
                GROUP BY i.id_investigation
                ORDER BY i.date_ouverture DESC
            `);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createInvestigation(req, res) {
        try {
            const { nom_investigation, description, priorite, id_enqueteur } = req.body;
            
            const result = await dbForensic.query(`
                INSERT INTO investigations (nom_investigation, description, priorite, id_enqueteur)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [nom_investigation, description, priorite, id_enqueteur]);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateInvestigation(req, res) {
        try {
            const { id } = req.params;
            const { nom_investigation, description, statut, priorite } = req.body;
            
            const result = await dbForensic.query(`
                UPDATE investigations 
                SET nom_investigation = $1, description = $2, statut = $3, priorite = $4
                WHERE id_investigation = $5
                RETURNING *
            `, [nom_investigation, description, statut, priorite, id]);
            
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    start(port = 3001) {
        this.app.listen(port, () => {
            console.log(`🔧 AURA Admin Dashboard démarré sur http://localhost:${port}/admin`);
        });
    }
}

module.exports = AdminDashboard;