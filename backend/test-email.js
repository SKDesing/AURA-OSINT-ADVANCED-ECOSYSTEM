const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.mailtrap' });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: '"AURA OSINT" <noreply@aura-osint.com>',
  to: 'test@example.com',
  subject: 'Test AURA OSINT - Mailtrap',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00ff88;">🛡️ AURA OSINT Test Email</h2>
      <p>Ceci est un test d'envoi d'email via Mailtrap.</p>
      <p><strong>Status:</strong> ✅ Configuration réussie</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Erreur:', error);
  } else {
    console.log('✅ Email envoyé:', info.response);
    console.log('📧 Vérifiez votre inbox Mailtrap');
  }
});