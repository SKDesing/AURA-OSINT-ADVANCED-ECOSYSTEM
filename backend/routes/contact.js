const express = require('express');
const emailService = require('../services/email.service');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 emails max par IP
  message: 'Trop de messages envoyés, réessayez dans 15 minutes'
});

router.post('/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nom, email et message requis' 
      });
    }

    // Envoi email équipe
    await emailService.sendContactEmail({
      name, email, company, service, message
    });

    // Envoi confirmation client
    await emailService.sendConfirmationEmail(email, name);

    res.json({
      success: true,
      message: 'Message envoyé avec succès'
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du message'
    });
  }
});

module.exports = router;