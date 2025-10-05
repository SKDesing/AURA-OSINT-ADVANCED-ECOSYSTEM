const express = require('express');
const router = express.Router();
const path = require('path');

// Import des wrappers OSINT
const SherlockWrapper = require('../../osint-tools/sherlock-wrapper');
const TheHarvesterWrapper = require('../../osint-tools/theharvester-wrapper');
const SpiderFootWrapper = require('../../osint-tools/spiderfoot-wrapper');
const ExifToolWrapper = require('../../osint-tools/exiftool-wrapper');

const sherlock = new SherlockWrapper();
const harvester = new TheHarvesterWrapper();
const spiderfoot = new SpiderFootWrapper();
const exiftool = new ExifToolWrapper();

// Sherlock - Recherche de pseudonymes
router.post('/sherlock/search', async (req, res) => {
    try {
        const { username, timeout = 60, sites = [] } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username requis' });
        }

        const results = await sherlock.searchUsername(username, { timeout, sites });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// theHarvester - Collecte d'informations
router.post('/harvester/search', async (req, res) => {
    try {
        const { domain, sources = ['google', 'bing'], limit = 500 } = req.body;
        
        if (!domain) {
            return res.status(400).json({ error: 'Domaine requis' });
        }

        const results = await harvester.harvest(domain, sources, limit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SpiderFoot - Reconnaissance automatique
router.post('/spiderfoot/scan', async (req, res) => {
    try {
        const { target, scanName, modules = [] } = req.body;
        
        if (!target) {
            return res.status(400).json({ error: 'Target requis' });
        }

        const results = await spiderfoot.runQuickScan(target, scanName);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ExifTool - Analyser les métadonnées
router.post('/exiftool/analyze', async (req, res) => {
    try {
        const { filePath, options = {} } = req.body;
        
        if (!filePath) {
            return res.status(400).json({ error: 'Chemin du fichier requis' });
        }

        const results = await exiftool.extractMetadata(filePath, options);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;