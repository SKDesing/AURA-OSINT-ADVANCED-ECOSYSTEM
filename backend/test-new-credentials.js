const nodemailer = require('nodemailer');

// Nouveaux credentials Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f5f16de9e4a35b",
    pass: "REMPLACEZ_PAR_LE_VRAI_MOT_DE_PASSE" // Révélez ****48db dans Mailtrap
  }
});

const mailOptions = {
  from: '"AURA OSINT" <noreply@aura-osint.com>',
  to: 'test@example.com',
  subject: '✅ AURA OSINT - Nouveaux Credentials',
  html: `
    <h2 style="color: #00ff88;">🛡️ AURA OSINT</h2>
    <p>✅ Test avec nouveaux credentials Mailtrap</p>
    <p>User: f5f16de9e4a35b</p>
    <p>Timestamp: ${new Date().toISOString()}</p>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Erreur:', error.message);
    console.log('📝 Révélez le mot de passe complet dans Mailtrap');
  } else {
    console.log('✅ SUCCESS! Email envoyé');
    console.log('📧 Message ID:', info.messageId);
  }
});