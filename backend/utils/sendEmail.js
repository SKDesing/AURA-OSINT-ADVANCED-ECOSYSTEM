// ============================================
// backend/utils/sendEmail.js
// Email Utility avec Mailtrap
// ============================================

const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT) || 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '91a6345a1b8416',
    pass: process.env.EMAIL_PASSWORD
  }
});

// Vérification de la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server ready - Mailtrap connected');
    console.log('📧 Email configured:', process.env.EMAIL_FROM || 'noreply@websk.com');
  }
});

/**
 * Envoie un email via Mailtrap
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `AURA OSINT <${process.env.EMAIL_FROM || 'noreply@websk.com'}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent:', {
      to,
      subject,
      messageId: info.messageId
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Template email de bienvenue
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  return sendEmail({
    to: userEmail,
    subject: '🎉 Bienvenue sur AURA OSINT!',
    html: `
      <!doctype html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Bienvenue ${userName}! 🎉</h1>
          </div>
          <div style="padding: 40px; background: #f9f9f9;">
            <h2>Merci de rejoindre AURA OSINT!</h2>
            <p>Nous sommes ravis de t'accueillir sur la plateforme OSINT la plus avancée.</p>
            <p>Tu peux maintenant profiter de toutes nos fonctionnalités d'intelligence.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="display: inline-block; margin-top: 20px; padding: 12px 30px; 
                      background: #667eea; color: white; text-decoration: none; 
                      border-radius: 5px;">
              Accéder à mon espace OSINT
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© 2024 AURA OSINT. Tous droits réservés.</p>
          </div>
        </body>
      </html>
    `
  });
};

module.exports = { sendEmail, sendWelcomeEmail, transporter };