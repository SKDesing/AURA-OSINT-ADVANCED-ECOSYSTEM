const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendContactEmail(data) {
    const { name, email, company, service, message } = data;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@aura-osint.com',
      to: 'contact@aura-osint.com',
      subject: `Nouveau contact AURA - ${service || 'Général'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff88;">Nouveau contact AURA OSINT</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Entreprise:</strong> ${company || 'Non spécifiée'}</p>
          <p><strong>Service:</strong> ${service || 'Non spécifié'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </div>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendConfirmationEmail(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@aura-osint.com',
      to: email,
      subject: 'Confirmation - AURA OSINT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff88;">Merci pour votre intérêt !</h2>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre message et vous recontacterons sous 24h.</p>
          <p>Cordialement,<br>L'équipe AURA OSINT</p>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();