const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('📧 TEST EMAIL COMPLET\n');

  try {
    // Test 1: Connection SMTP Mock
    console.log('1️⃣ Test Connection SMTP Mock...');
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: false
    });
    
    await transporter.verify();
    console.log('✅ Connection SMTP Mock OK');

    // Test 2: Email basique
    console.log('\n2️⃣ Test Email Basique...');
    const basicEmail = await transporter.sendMail({
      from: '"AURA Test" <test@aura-osint.com>',
      to: 'admin@aura-osint.com',
      subject: 'Test Basique AURA OSINT',
      text: `Test email envoyé à ${new Date().toISOString()}`
    });
    console.log(`✅ Email basique envoyé: ${basicEmail.messageId}`);

    // Test 3: Email HTML
    console.log('\n3️⃣ Test Email HTML...');
    const htmlEmail = await transporter.sendMail({
      from: '"AURA OSINT" <noreply@aura-osint.com>',
      to: 'test@example.com',
      subject: '🛡️ Test HTML AURA OSINT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #00ff88;">🛡️ AURA OSINT</h2>
          <p><strong>✅ Test HTML réussi</strong></p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">
            <p>Service email opérationnel</p>
          </div>
        </div>
      `
    });
    console.log(`✅ Email HTML envoyé: ${htmlEmail.messageId}`);

    // Test 4: Email avec pièce jointe (simulation)
    console.log('\n4️⃣ Test Email Rapport...');
    const reportEmail = await transporter.sendMail({
      from: '"AURA Reports" <reports@aura-osint.com>',
      to: 'admin@aura-osint.com',
      subject: '📊 Rapport OSINT - Test',
      html: `
        <h3>📊 Rapport OSINT</h3>
        <p>Rapport généré automatiquement par AURA OSINT</p>
        <ul>
          <li>Profiles analysés: 10</li>
          <li>Menaces détectées: 2</li>
          <li>Score de risque moyen: 35/100</li>
        </ul>
        <p><em>Rapport complet disponible dans le dashboard</em></p>
      `
    });
    console.log(`✅ Email rapport envoyé: ${reportEmail.messageId}`);

    console.log('\n🎯 EMAIL: 100% OPÉRATIONNEL');

  } catch (error) {
    console.error('❌ EMAIL ERROR:', error.message);
    console.log('\n💡 Vérifiez que le serveur SMTP mock est démarré:');
    console.log('   node email-mock-server.js');
  }
}

if (require.main === module) {
  testEmail().then(() => process.exit(0));
}

module.exports = { testEmail };