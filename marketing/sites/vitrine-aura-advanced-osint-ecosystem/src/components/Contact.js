import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Message envoyé avec succès!', {
          duration: 4000,
          style: {
            background: '#0a0e27',
            color: '#00ff88',
            border: '1px solid #00ff88'
          }
        });

        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Erreur lors de l\'envoi. Réessayez.', {
        duration: 4000,
        style: {
          background: '#0a0e27',
          color: '#ff4444',
          border: '1px solid #ff4444'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="contact">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>📞 Contactez-nous</h2>
          <p>Prêt à transformer votre approche OSINT ?</p>
        </motion.div>
        
        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3>Informations de contact</h3>
            
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <strong>Email</strong>
                <p>contact@tiktokliveanalyser.com</p>
                <p>security@tiktokliveanalyser.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <strong>Support 24/7</strong>
                <p>Enterprise SLA disponible</p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <strong>Localisation</strong>
                <p>Worldwide - Remote First</p>
              </div>
            </div>
            
            <div className="social-links">
              <h4>Suivez-nous</h4>
              <div className="social-icons">
                <a href="https://linkedin.com/company/aura-osint" className="social-link"><FaLinkedin /></a>
                <a href="https://github.com/SKDesing/TikTok-Live-Analyser" className="social-link"><FaGithub /></a>
                <a href="https://twitter.com/aura-osint" className="social-link"><FaTwitter /></a>
              </div>
            </div>
          </motion.div>
          
          <motion.form 
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="form-group">
              <label>Nom complet *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email professionnel *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Entreprise</label>
              <input 
                type="text" 
                name="company" 
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Service d'intérêt</label>
              <select 
                name="service" 
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un service</option>
                <option value="osint">OSINT Investigation</option>
                <option value="forensic">Intelligence Forensique</option>
                <option value="custom">Développement Custom</option>
                <option value="consulting">Consulting & Formation</option>
                <option value="security">Sécurité & Compliance</option>
                <option value="analytics">Analytics & Reporting</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Message *</label>
              <textarea 
                name="message" 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre projet ou vos besoins..."
                required
              ></textarea>
            </div>
            
            <motion.button 
              type="submit" 
              className="btn-primary"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le message'
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default Contact;