const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: 'success', message: 'Admin Dashboard API' });
});

router.get('/stats', (req, res) => {
    res.json({
        users: 0,
        activeSessions: 0,
        analytics: { requests: 0 }
    });
});

module.exports = router;