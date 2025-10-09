const nodemailer = require('nodemailer');

setTimeout(() => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: '91a6345a1b8416',
      pass: 'Mohand/06'
    }
  });

  transporter.sendMail({
    from: '"AURA OSINT" <noreply@aura-osint.com>',
    to: 'test@example.com',
    subject: '✅ AURA OSINT - Configuration Réussie',
    html: '<h2>🛡️ AURA OSINT</h2><p>✅ Email configuré avec succès!</p>'
  }, (error, info) => {
    if (error) {
      console.error('❌ Erreur:', error.message);
    } else {
      console.log('✅ SUCCESS! Email envoyé');
      console.log('📧 Message ID:', info.messageId);
    }
  });
}, 30000); // Attendre 30 secondes

console.log('⏳ Attente 30s pour éviter le rate limiting...');