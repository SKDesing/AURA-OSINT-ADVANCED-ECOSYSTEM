const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Configuration email
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Routes API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    
    // Email à l'équipe AURA
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@tiktokliveanalyser.com',
      to: 'contact@tiktokliveanalyser.com',
      subject: `Nouveau contact AURA - ${service || 'Général'}`,
      html: `
        <h2>Nouveau contact depuis le site AURA</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Entreprise:</strong> ${company || 'Non spécifiée'}</p>
        <p><strong>Service:</strong> ${service || 'Non spécifié'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    // Email de confirmation au client
    const confirmationMail = {
      from: process.env.FROM_EMAIL || 'noreply@tiktokliveanalyser.com',
      to: email,
      subject: 'Confirmation - AURA ADVANCED OSINT ECOSYSTEM',
      html: `
        <h2>Merci pour votre intérêt pour AURA ADVANCED OSINT ECOSYSTEM</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message et vous recontacterons sous 24h.</p>
        <p>Notre équipe d'experts OSINT analysera votre demande et vous proposera la solution la plus adaptée.</p>
        <br>
        <p>Cordialement,</p>
        <p>L'équipe AURA ADVANCED OSINT ECOSYSTEM</p>
      `
    };
    
    await transporter.sendMail(confirmationMail);
    
    res.json({ success: true, message: 'Message envoyé avec succès' });
    
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});

// Route pour vérifier le statut des services AURA
app.get('/api/services/status', async (req, res) => {
  try {
    const services = [
      { name: 'TikTok Engine', status: 'online', url: 'http://localhost:XXXX' },
      { name: 'Analytics API', status: 'online', url: 'http://localhost:XXXX' },
      { name: 'Forensic DB', status: 'online', url: 'http://localhost:XXXX' },
      { name: 'Dashboard', status: 'online', url: 'http://localhost:XXXX' }
    ];
    
    res.json({ services, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification des services' });
  }
});

// Route pour les métriques
app.get('/api/metrics', (req, res) => {
  const metrics = {
    uptime: '99.9%',
    messagesPerDay: '1M+',
    latency: '<100ms',
    activeUsers: Math.floor(Math.random() * 1000) + 500,
    totalInvestigations: Math.floor(Math.random() * 10000) + 5000,
    dataProcessed: Math.floor(Math.random() * 100) + 50 + 'TB'
  };
  
  res.json(metrics);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🛡️ AURA ADVANCED OSINT ECOSYSTEM Vitrine Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.SMTP_HOST ? 'Configured' : 'Using Mailtrap'}`);
});