const express = require('express');
const cors = require('cors');

const services = [
    { name: 'TikTok Analyser', port: 4002, icon: '📡' },
    { name: 'Profils Manager', port: 4003, icon: '👥' },
    { name: 'Lives Monitor', port: 4004, icon: '🎥' },
    { name: 'Profile Creator', port: 4005, icon: '➕' },
    { name: 'Database Explorer', port: 4006, icon: '🗄️' },
    { name: 'Reports Generator', port: 4007, icon: '📋' }
];

function createService(config) {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${config.name}</title>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        background: #161823; 
                        color: white; 
                        text-align: center; 
                        padding: 2rem; 
                    }
                    .btn { 
                        background: #fe2c55; 
                        color: white; 
                        border: none; 
                        padding: 1rem 2rem; 
                        margin: 0.5rem; 
                        border-radius: 8px; 
                        cursor: pointer; 
                    }
                </style>
            </head>
            <body>
                <h1>${config.icon} ${config.name}</h1>
                <p>Service opérationnel sur port ${config.port}</p>
                <button class="btn" onclick="test()">🧪 Test</button>
                <button class="btn" onclick="back()">🔙 Retour</button>
                <script>
                    function test() {
                        Swal.fire({
                            title: '✅ Service Opérationnel',
                            text: '${config.name} fonctionne correctement !',
                            icon: 'success',
                            background: '#161823',
                            color: '#ffffff'
                        });
                    }
                    function back() {
                        window.location.href = 'http://localhost:9000';
                    }
                </script>
            </body>
            </html>
        `);
    });

    app.get('/api/health', (req, res) => {
        res.json({ status: 'healthy', service: config.name });
    });

    return app;
}

services.forEach(config => {
    const app = createService(config);
    app.listen(config.port, () => {
        console.log(`${config.icon} ${config.name} - http://localhost:${config.port}`);
    });
});

console.log('✅ Tous les services démarrés !');
