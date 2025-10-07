const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'running',
        services: [
            { name: 'analytics', status: 'online', port: 4002 },
            { name: 'gui', status: 'online', port: 3000 }
        ]
    }));
});

const PORT = 4001;
server.listen(PORT, () => {
    console.log(`[orchestrator] 🎛️ Service Orchestrator démarré sur le port ${PORT}`);
});