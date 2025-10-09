const nodemailer = require('nodemailer');

// Configuration Mailtrap de démonstration
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: '91a6345a1b8416',
    pass: 'b8c4e1ce4f2a3d' // Mot de passe de démonstration complet
  }
});

const mailOptions = {
  from: '"AURA OSINT" <noreply@aura-osint.com>',
  to: 'test@example.com',
  subject: '🛡️ Test AURA OSINT - Mailtrap Demo',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #00ff88; text-align: center;">🛡️ AURA OSINT</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">✅ Test Email Réussi</h3>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Service:</strong> Mailtrap SMTP</p>
        <p><strong>Status:</strong> Configuration validée</p>
      </div>
      <p style="color: #666; font-size: 12px; text-align: center;">
        AURA OSINT Advanced Ecosystem - Professional Intelligence Platform
      </p>
    </div>
  `
};

console.log('🔄 Envoi du test email...');
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n📝 Solutions possibles:');
    console.log('1. Vérifiez vos credentials Mailtrap');
    console.log('2. Régénérez un nouveau mot de passe dans Mailtrap');
    console.log('3. Vérifiez que votre compte Mailtrap est actif');
  } else {
    console.log('✅ Email envoyé avec succès!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📨 Vérifiez votre inbox Mailtrap');
  }
});