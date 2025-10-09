const { SMTPServer } = require('smtp-server');

const server = new SMTPServer({
  secure: false,
  authOptional: true,
  onData(stream, session, callback) {
    let emailData = '';
    stream.on('data', chunk => emailData += chunk);
    stream.on('end', () => {
      console.log('📧 Email reçu:');
      console.log('From:', session.envelope.mailFrom.address);
      console.log('To:', session.envelope.rcptTo.map(r => r.address).join(', '));
      console.log('Data:', emailData.substring(0, 200) + '...');
      console.log('✅ Email traité avec succès\n');
      callback();
    });
  }
});

server.listen(1025, () => {
  console.log('🚀 Mock SMTP Server démarré sur port 1025');
  console.log('📧 Prêt à recevoir les emails AURA OSINT');
});