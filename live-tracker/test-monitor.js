const express = require('express');
const app = express();

let testStats = {
    messagesIntercepted: 0,
    preDisplayAlerts: 0,
    tikTokDetection: false,
    lastMessage: null,
    startTime: new Date()
};

// Monitoring endpoint
app.get('/monitor', (req, res) => {
    const uptime = Math.floor((new Date() - testStats.startTime) / 1000);
    res.json({
        ...testStats,
        uptime: `${uptime}s`,
        status: testStats.tikTokDetection ? '❌ DÉTECTÉ' : '✅ STEALTH'
    });
});

// Test endpoint pour simuler interception
app.post('/test-intercept', express.json(), (req, res) => {
    testStats.messagesIntercepted++;
    testStats.lastMessage = req.body;
    console.log(`🎯 Message intercepté: ${JSON.stringify(req.body)}`);
    res.json({ success: true });
});

app.listen(3001, () => {
    console.log('🔍 Moniteur de test actif sur http://localhost:3001/monitor');
});