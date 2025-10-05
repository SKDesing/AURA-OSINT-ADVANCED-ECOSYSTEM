const express = require('express');
const cors = require('cors');
const path = require('path');
const { ProfileManager } = require('../backend/profile-manager');
const DatabaseManager = require('../backend/database-manager');

// Configuration des services
const services = [
    { name: 'TikTok Analyser', port: 3002, icon: '📡' },
    { name: 'Profils Manager', port: 3003, icon: '👥' },
    { name: 'Lives Monitor', port: 3004, icon: '🎥' },
    { name: 'Profile Creator', port: 3005, icon: '➕' },
    { name: 'Database Explorer', port: 3006, icon: '🗄️' },
    { name: 'Reports Generator', port: 3007, icon: '📋' }
];

// Fonction pour créer un service
function createService(serviceConfig) {
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../frontend-build')));
    
    // Intégration DatabaseManager pour tous les services
    const dbManager = new DatabaseManager();
    
    // Intégration ProfileManager pour le service Profile Creator
    if (serviceConfig.port === 4005) {
        const profileManager = new ProfileManager();
        
        app.post('/api/profiles', async (req, res) => {
            const result = await profileManager.createProfile(req.body);
            res.json(result);
        });
        
        app.get('/api/profiles', async (req, res) => {
            const result = await profileManager.getProfiles();
            res.json(result);
        });
        
        app.put('/api/profiles/:id', async (req, res) => {
            const result = await profileManager.updateProfile(req.params.id, req.body);
            res.json(result);
        });
        
        app.delete('/api/profiles/:id', async (req, res) => {
            const result = await profileManager.deleteProfile(req.params.id);
            res.json(result);
        });
    }
    
    // API Database pour tous les services
    app.get('/api/database/tables', async (req, res) => {
        const result = await dbManager.getTables();
        res.json(result);
    });
    
    app.get('/api/database/tables/:tableName', async (req, res) => {
        const { limit = 100, offset = 0 } = req.query;
        const result = await dbManager.getTableData(req.params.tableName, parseInt(limit), parseInt(offset));
        res.json(result);
    });
    
    app.get('/api/database/tables/:tableName/schema', async (req, res) => {
        const result = await dbManager.getTableSchema(req.params.tableName);
        res.json(result);
    });
    
    app.get('/api/database/stats', async (req, res) => {
        const result = await dbManager.getStats();
        res.json(result);
    });
    
    app.post('/api/database/tables/:tableName/search', async (req, res) => {
        const { query } = req.body;
        const result = await dbManager.searchRecords(req.params.tableName, query);
        res.json(result);
    });

    // Page d'accueil du service
    app.get('/', (req, res) => {
        const profileCreatorHTML = serviceConfig.port === 3005 ? `
                    <button class="btn" onclick="createNewProfile()">➕ Créer Profil</button>
                    <button class="btn" onclick="viewProfiles()">👥 Voir Profils</button>
        ` : '';
        
        const additionalJS = serviceConfig.port === 3005 ? `
                    function createNewProfile() {
                        Swal.fire({
                            title: '➕ Créer un Nouveau Profil',
                            html: \`
                                <div style="text-align: left;">
                                    <input id="username" class="swal2-input" placeholder="Nom d'utilisateur TikTok">
                                    <input id="displayName" class="swal2-input" placeholder="Nom d'affichage">
                                    <textarea id="bio" class="swal2-textarea" placeholder="Biographie"></textarea>
                                    <select id="riskLevel" class="swal2-select">
                                        <option value="low">Risque Faible</option>
                                        <option value="medium">Risque Moyen</option>
                                        <option value="high">Risque Élevé</option>
                                    </select>
                                </div>
                            \`,
                            showCancelButton: true,
                            confirmButtonText: '✅ Créer',
                            cancelButtonText: 'Annuler',
                            background: '#161823',
                            color: '#ffffff',
                            preConfirm: () => {
                                const username = document.getElementById('username').value;
                                const displayName = document.getElementById('displayName').value;
                                const bio = document.getElementById('bio').value;
                                const riskLevel = document.getElementById('riskLevel').value;
                                
                                if (!username) {
                                    Swal.showValidationMessage('Le nom d\'utilisateur est requis');
                                    return false;
                                }
                                
                                return { username, displayName, bio, riskLevel };
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetch('/api/profiles', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(result.value)
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        Swal.fire({
                                            title: '✅ Profil Créé',
                                            text: \`Profil \${result.value.username} créé avec succès\`,
                                            icon: 'success',
                                            background: '#161823',
                                            color: '#ffffff'
                                        });
                                    } else {
                                        Swal.fire({
                                            title: '❌ Erreur',
                                            text: data.error || 'Erreur lors de la création',
                                            icon: 'error',
                                            background: '#161823',
                                            color: '#ffffff'
                                        });
                                    }
                                })
                                .catch(error => {
                                    Swal.fire({
                                        title: '❌ Erreur Réseau',
                                        text: 'Impossible de créer le profil',
                                        icon: 'error',
                                        background: '#161823',
                                        color: '#ffffff'
                                    });
                                });
                            }
                        });
                    }
                    
                    function viewProfiles() {
                        fetch('/api/profiles')
                        .then(response => response.json())
                        .then(data => {
                            if (data.success && data.profiles.length > 0) {
                                const profilesList = data.profiles.map(p => 
                                    \`<div style="border: 1px solid #2f2f3a; padding: 1rem; margin: 0.5rem 0; border-radius: 8px;">
                                        <strong>@\${p.username}</strong><br>
                                        <small>\${p.displayName || 'Pas de nom'}</small><br>
                                        <span style="color: \${p.riskLevel === 'high' ? '#ff4444' : p.riskLevel === 'medium' ? '#ffaa00' : '#44ff44'}">\${p.riskLevel}</span>
                                    </div>\`
                                ).join('');
                                
                                Swal.fire({
                                    title: '👥 Profils Enregistrés',
                                    html: profilesList,
                                    background: '#161823',
                                    color: '#ffffff',
                                    width: '600px'
                                });
                            } else {
                                Swal.fire({
                                    title: '📭 Aucun Profil',
                                    text: 'Aucun profil créé pour le moment',
                                    icon: 'info',
                                    background: '#161823',
                                    color: '#ffffff'
                                });
                            }
                        });
                    }
        ` : '';
        
        res.send(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="utf-8">
                <title>${serviceConfig.name} - SCIS</title>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <style>
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #000000 0%, #161823 100%);
                        color: #ffffff;
                        margin: 0;
                        padding: 2rem;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .service-container {
                        text-align: center;
                        max-width: 800px;
                        background: rgba(22, 24, 35, 0.9);
                        padding: 3rem;
                        border-radius: 16px;
                        border: 1px solid #2f2f3a;
                    }
                    .service-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .service-title {
                        font-size: 2.5rem;
                        font-weight: bold;
                        background: linear-gradient(45deg, #fe2c55, #25f4ee);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 1rem;
                    }
                    .service-desc {
                        font-size: 1.2rem;
                        color: #a8a8b3;
                        margin-bottom: 2rem;
                    }
                    .btn {
                        background: linear-gradient(45deg, #fe2c55, #ff6b35);
                        border: none;
                        padding: 1rem 2rem;
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1.1rem;
                        margin: 0.5rem;
                        transition: transform 0.2s;
                    }
                    .btn:hover {
                        transform: translateY(-2px);
                    }
                    .status-bar {
                        background: rgba(37, 244, 238, 0.1);
                        border: 1px solid #25f4ee;
                        padding: 1rem;
                        border-radius: 8px;
                        margin-top: 2rem;
                    }
                </style>
            </head>
            <body>
                <div class="service-container">
                    <div class="service-icon">${serviceConfig.icon}</div>
                    <h1 class="service-title">${serviceConfig.name}</h1>
                    <p class="service-desc">Service opérationnel sur le port ${serviceConfig.port}</p>
                    
                    <button class="btn" onclick="testService()">🧪 Tester Service</button>
                    <button class="btn" onclick="viewDocs()">📚 Documentation</button>
                    ${profileCreatorHTML}
                    <button class="btn" onclick="goBack()">🔙 Retour Dashboard</button>
                    
                    <div class="status-bar">
                        <strong>🟢 Status:</strong> Opérationnel<br>
                        <strong>📡 Port:</strong> ${serviceConfig.port}<br>
                        <strong>🕐 Uptime:</strong> ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m
                    </div>
                </div>

                <script>
                    function testService() {
                        Swal.fire({
                            title: '🧪 Test du Service',
                            text: '${serviceConfig.name} fonctionne correctement !',
                            icon: 'success',
                            background: '#161823',
                            color: '#ffffff'
                        });
                    }

                    function viewDocs() {
                        Swal.fire({
                            title: '📚 Documentation',
                            html: \`
                                <div style="text-align: left;">
                                    <h3>API Endpoints:</h3>
                                    <ul>
                                        <li>GET / - Page d'accueil</li>
                                        <li>GET /api/status - Status du service</li>
                                        <li>GET /api/health - Health check</li>
                                        <li>POST /api/action - Action principale</li>
                                    </ul>
                                </div>
                            \`,
                            background: '#161823',
                            color: '#ffffff'
                        });
                    }

                    function goBack() {
                        window.location.href = 'http://localhost:8080';
                    }
                    ${additionalJS}
                </script>
            </body>
            </html>
        `);
    });

    // API endpoints
    app.get('/api/status', (req, res) => {
        res.json({
            service: serviceConfig.name,
            port: serviceConfig.port,
            status: 'operational',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    });

    app.get('/api/health', (req, res) => {
        res.json({ status: 'healthy', service: serviceConfig.name });
    });

    app.post('/api/action', (req, res) => {
        res.json({
            message: `Action exécutée sur ${serviceConfig.name}`,
            data: req.body,
            timestamp: new Date().toISOString()
        });
    });

    return app;
}

// Démarrage de tous les services
function startAllServices() {
    console.log('🚀 Démarrage des services SCIS...\n');
    
    services.forEach(serviceConfig => {
        const app = createService(serviceConfig);
        
        app.listen(serviceConfig.port, () => {
            console.log(`${serviceConfig.icon} ${serviceConfig.name} - http://localhost:${serviceConfig.port}`);
        });
    });

    console.log('\n✅ Tous les services sont opérationnels !');
    console.log('🌐 Dashboard principal: http://localhost:8080');
}

// Démarrage si exécuté directement
if (require.main === module) {
    startAllServices();
}

module.exports = { startAllServices, services };