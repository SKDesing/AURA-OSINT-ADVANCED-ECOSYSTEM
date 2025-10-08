// ============================================
// backend/api/test-email.js
// Route de test email Mailtrap
// ============================================

const express = require('express');
const { sendEmail, transporter } = require('../utils/sendEmail');
const router = express.Router();

// Route de test email
router.get('/test-email', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@websk.com',
      to: 'test@example.com',
      subject: '✅ Test Email AURA OSINT - Mailtrap',
      text: 'Configuration email OK!',
      html: `
        <!doctype html>
        <html>
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          </head>
          <body style="font-family: sans-serif;">
            <div style="display: block; margin: auto; max-width: 600px;">
              <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">
                ✅ Configuration Email AURA OSINT OK!
              </h1>
              <p>Votre serveur backend peut maintenant envoyer des emails.</p>
              <p><strong>Service:</strong> Mailtrap</p>
              <p><strong>Port:</strong> 2525</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <hr>
              <p style="color: #666; font-size: 12px;">
                Cet email est capturé par Mailtrap et ne sera pas envoyé à de vrais destinataires.
              </p>
            </div>
          </body>
        </html>
      `
    });

    console.log('✅ Email sent:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;