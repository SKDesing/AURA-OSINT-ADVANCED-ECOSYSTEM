// ============================================
// 📄 AURA OSINT - REPORTS API
// ============================================
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { generateReport } = require('../services/report-generator');

// ============================================
// POST /api/reports/generate/:sessionId
// ============================================
router.post('/generate/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { type = 'pdf' } = req.body;

        const result = await generateReport(sessionId, type);

        res.json({
            success: true,
            report: result,
            download_url: `/api/reports/download/${result.filename}`
        });

    } catch (error) {
        console.error('Erreur génération rapport:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// GET /api/reports/download/:filename
// ============================================
router.get('/download/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filepath = path.join(__dirname, '../../reports', filename);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Fichier non trouvé' });
        }

        res.download(filepath);

    } catch (error) {
        console.error('Erreur téléchargement:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;