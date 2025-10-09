const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  auth: false
});

const mailOptions = {
  from: '"AURA OSINT" <noreply@aura-osint.com>',
  to: 'admin@aura-osint.com',
  subject: '✅ AURA OSINT - Email Service Opérationnel',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #00ff88; text-align: center;">🛡️ AURA OSINT</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333;">✅ Service Email Configuré</h3>
        <p><strong>Status:</strong> Opérationnel</p>
        <p><strong>Serveur:</strong> SMTP Local Mock</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>
      <p style="color: #666; font-size: 12px; text-align: center;">
        AURA OSINT Advanced Ecosystem - Professional Intelligence Platform
      </p>
    </div>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Erreur:', error.message);
  } else {
    console.log('✅ Email envoyé avec succès!');
    console.log('📧 Message ID:', info.messageId);
    console.log('🎯 Service email AURA OSINT opérationnel');
  }
});