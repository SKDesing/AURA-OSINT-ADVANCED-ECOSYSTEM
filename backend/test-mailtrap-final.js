const nodemailer = require('nodemailer');

// Credentials Mailtrap fournis
const credentials = {
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  user: '91a6345a1b8416',
  // Le mot de passe est masqué dans l'interface, essayons les possibilités
  passwords: [
    'b8c4e1ce',           // Version courte
    'b8c4e1ce4f2a',       // Version étendue
    'b8c4e1ce4f2a3d',     // Version longue
    // Vous devez révéler le vrai mot de passe dans Mailtrap
  ]
};

async function testCredentials(password) {
  return new Promise((resolve) => {
    const transporter = nodemailer.createTransport({
      host: credentials.host,
      port: credentials.port,
      secure: false,
      auth: {
        user: credentials.user,
        pass: password
      }
    });

    const mailOptions = {
      from: '"AURA OSINT" <noreply@aura-osint.com>',
      to: 'test@example.com',
      subject: '✅ AURA OSINT - Test Réussi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00ff88;">🛡️ AURA OSINT</h2>
          <p><strong>✅ Configuration Mailtrap validée</strong></p>
          <p>Password testé: ${password.substring(0, 4)}****</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        resolve({ success: false, password, error: error.message });
      } else {
        resolve({ success: true, password, messageId: info.messageId });
      }
    });
  });
}

async function testAllPasswords() {
  console.log('🔄 Test des credentials Mailtrap...\n');
  
  for (const password of credentials.passwords) {
    console.log(`Testing password: ${password.substring(0, 4)}****`);
    const result = await testCredentials(password);
    
    if (result.success) {
      console.log('✅ SUCCESS! Email envoyé avec succès');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log(`🔑 Password correct: ${result.password}`);
      console.log('\n📝 Mettez à jour .env.mailtrap avec ce mot de passe');
      return;
    } else {
      console.log(`❌ Failed: ${result.error}\n`);
    }
  }
  
  console.log('🚨 Aucun mot de passe ne fonctionne.');
  console.log('📝 Actions requises:');
  console.log('1. Allez sur https://mailtrap.io');
  console.log('2. Cliquez sur "Reset Credentials"');
  console.log('3. Copiez le nouveau mot de passe complet');
  console.log('4. Mettez à jour .env.mailtrap');
}

testAllPasswords();