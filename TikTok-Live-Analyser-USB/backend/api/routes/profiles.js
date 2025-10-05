const express = require('express');
const router = express.Router();
const { createProfile, getProfiles, getProfileById, validateProfileCreation } = require('../controllers/profileController');


// GET /api/profiles - Récupérer tous les profils
router.get('/', getProfiles);

// GET /api/profiles/:id - Récupérer un profil spécifique
router.get('/:id', getProfileById);

// POST /api/profiles - Créer un nouveau profil complet
router.post('/', validateProfileCreation, createProfile);

module.exports = router;