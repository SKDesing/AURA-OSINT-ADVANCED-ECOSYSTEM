const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function sendEmail(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validation des données
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Champs obligatoires manquants'
      });
    }

    // Construction de l'email
    const mailOptions = {
      from: `"${name}" <${process.env.MAILTRAP_FROM || 'contact@aura-osint.com'}>`,
      to: 'team@aura-osint.com',
      replyTo: email,
      subject: subject || `[AURA OSINT] Message de ${name}`,
      text: `
Nouveau message depuis la vitrine AURA OSINT

De: ${name}
Email: ${email}
Sujet: ${subject || 'Pas de sujet'}

Message:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #e0e0e0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid #00ff88;
      border-radius: 12px;
      padding: 30px;
      backdrop-filter: blur(10px);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #00ff88;
      font-size: 24px;
      margin: 0;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
    .field {
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(0, 255, 136, 0.1);
      border-left: 3px solid #00ff88;
      border-radius: 4px;
    }
    .field strong {
      color: #00ff88;
      display: block;
      margin-bottom: 5px;
    }
    .message {
      background: rgba(0, 0, 0, 0.3);
      padding: 20px;
      border-radius: 8px;
      white-space: pre-wrap;
      font-family: 'Courier New', monospace;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 AURA OSINT - Nouveau Contact</h1>
    </div>
    <div class="field">
      <strong>👤 Nom:</strong>
      ${name}
    </div>
    <div class="field">
      <strong>📧 Email:</strong>
      <a href="mailto:${email}" style="color: #00ff88;">${email}</a>
    </div>
    <div class="field">
      <strong>📌 Sujet:</strong>
      ${subject || 'Aucun sujet'}
    </div>
    <div class="field">
      <strong>💬 Message:</strong>
      <div class="message">${message}</div>
    </div>
    <div class="footer">
      Envoyé depuis la vitrine AURA ADVANCED OSINT ECOSYSTEM<br>
      © ${new Date().getFullYear()} - Tous droits réservés
    </div>
  </div>
</body>
</html>
      `
    };

    // Envoi de l'email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email envoyé:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email'
    });
  }
}

module.exports = sendEmail;