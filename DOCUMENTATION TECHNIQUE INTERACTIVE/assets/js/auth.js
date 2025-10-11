/**
 * 🔐 AURA AUTHENTICATION SYSTEM
 * Système d'authentification avec validation et collecte de données
 */

class AURAAuth {
  constructor() {
    this.phi = 1.618;
    this.users = new Map();
    this.currentUser = null;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    // Compte ROOT prédéfini
    this.users.set('root', {
      username: 'root',
      password: 'Phi1.618Golden!',
      email: 'root@aura-osint.local',
      role: 'administrator',
      permissions: ['all'],
      created: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0
    });
    
    this.initializeEventListeners();
  }

  /**
   * 🚀 Initialise le système d'authentification
   */
  static initialize() {
    const auth = new AURAAuth();
    window.AURAAuthInstance = auth;
    return auth;
  }

  /**
   * 🎯 Configure les event listeners
   */
  initializeEventListeners() {
    // Formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Validation en temps réel du mot de passe
    const passwordInput = document.getElementById('reg-password');
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => this.validatePasswordStrength(e.target.value));
    }

    // Déconnexion
    document.addEventListener('click', (e) => {
      if (e.target.id === 'btn-logout' || e.target.closest('#btn-logout')) {
        this.handleLogout();
      }
    });

    // Auto-logout sur inactivité
    this.setupAutoLogout();
  }

  /**
   * 🔑 Gère la connexion
   */
  async handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const username = formData.get('username') || document.getElementById('login-username').value;
    const password = formData.get('password') || document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;

    // Ajouter état de chargement
    form.classList.add('loading');

    try {
      // Simuler délai réseau (Φ secondes)
      await this.delay(800 * this.phi);

      // Vérifier les identifiants
      const user = this.users.get(username);
      
      if (!user || user.password !== password) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
      }

      // Mettre à jour les statistiques utilisateur
      user.lastLogin = new Date().toISOString();
      user.loginCount++;

      // Créer la session
      this.currentUser = user;
      this.saveSession(rememberMe);

      // Collecter données de connexion pour analytics
      this.collectLoginData(user, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: await this.getClientIP(),
        rememberMe: rememberMe
      });

      // Succès
      await Swal.fire({
        icon: 'success',
        title: 'Connexion réussie !',
        text: `Bienvenue ${user.username}`,
        timer: 1500,
        showConfirmButton: false,
        background: 'var(--color-surface)',
        color: 'var(--color-text)'
      });

      // Transition vers le dashboard
      this.transitionToDashboard();

    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: error.message,
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        confirmButtonColor: 'var(--gold-primary)'
      });
    } finally {
      form.classList.remove('loading');
    }
  }

  /**
   * 📝 Gère l'inscription
   */
  async handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Extraire toutes les données du formulaire
    const userData = {
      firstname: formData.get('firstname') || document.getElementById('reg-firstname').value,
      lastname: formData.get('lastname') || document.getElementById('reg-lastname').value,
      email: formData.get('email') || document.getElementById('reg-email').value,
      username: formData.get('username') || document.getElementById('reg-username').value,
      password: formData.get('password') || document.getElementById('reg-password').value,
      passwordConfirm: formData.get('password-confirm') || document.getElementById('reg-password-confirm').value,
      organization: formData.get('organization') || document.getElementById('reg-organization').value,
      purpose: formData.get('purpose') || document.getElementById('reg-purpose').value,
      justification: formData.get('justification') || document.getElementById('reg-justification').value,
      terms: document.getElementById('reg-terms')?.checked || false,
      ethics: document.getElementById('reg-ethics')?.checked || false
    };

    // Ajouter état de chargement
    form.classList.add('loading');

    try {
      // Validation complète
      this.validateRegistrationData(userData);

      // Simuler délai de traitement
      await this.delay(1500 * this.phi);

      // Créer le compte (en attente de validation)
      const newUser = {
        ...userData,
        id: this.generateUserId(),
        role: 'user',
        status: 'pending_approval',
        created: new Date().toISOString(),
        lastLogin: null,
        loginCount: 0,
        permissions: ['read_only']
      };

      // Sauvegarder (simulation)
      this.users.set(userData.username, newUser);

      // Collecter données d'inscription pour analytics
      this.collectRegistrationData(newUser);

      // Succès
      await Swal.fire({
        icon: 'success',
        title: 'Inscription soumise !',
        html: `
          <p>Votre demande d'accès a été enregistrée.</p>
          <p><strong>ID de demande:</strong> ${newUser.id}</p>
          <p>Vous recevrez un email de confirmation sous 24-48h.</p>
        `,
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        confirmButtonColor: 'var(--gold-primary)'
      });

      // Retour à l'onglet connexion
      const loginTab = document.querySelector('[data-bs-target="#login-tab"]');
      if (loginTab) {
        loginTab.click();
      }

      // Reset du formulaire
      form.reset();

    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Erreur d\'inscription',
        text: error.message,
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        confirmButtonColor: 'var(--gold-primary)'
      });
    } finally {
      form.classList.remove('loading');
    }
  }

  /**
   * ✅ Valide les données d'inscription
   */
  validateRegistrationData(data) {
    // Vérifications de base
    if (!data.firstname || data.firstname.length < 2) {
      throw new Error('Le prénom doit contenir au moins 2 caractères');
    }

    if (!data.lastname || data.lastname.length < 2) {
      throw new Error('Le nom doit contenir au moins 2 caractères');
    }

    if (!this.isValidEmail(data.email)) {
      throw new Error('Adresse email invalide');
    }

    if (!data.username || data.username.length < 3) {
      throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    }

    if (this.users.has(data.username)) {
      throw new Error('Ce nom d\'utilisateur est déjà pris');
    }

    if (!this.isStrongPassword(data.password)) {
      throw new Error('Le mot de passe ne respecte pas les critères de sécurité');
    }

    if (data.password !== data.passwordConfirm) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (!data.organization) {
      throw new Error('Veuillez sélectionner votre type d\'organisation');
    }

    if (!data.purpose) {
      throw new Error('Veuillez préciser l\'objectif d\'utilisation');
    }

    if (!data.justification || data.justification.length < 50) {
      throw new Error('La justification doit contenir au moins 50 caractères');
    }

    if (!data.terms) {
      throw new Error('Vous devez accepter les conditions d\'utilisation');
    }

    if (!data.ethics) {
      throw new Error('Vous devez vous engager à une utilisation éthique');
    }
  }

  /**
   * 🔒 Valide la force du mot de passe
   */
  validatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const securityDots = document.querySelectorAll('.security-dot');
    
    if (!password) {
      if (strengthBar) strengthBar.style.width = '0%';
      securityDots.forEach(dot => dot.classList.remove('active'));
      return;
    }

    let score = 0;
    const checks = [
      password.length >= 8,                    // Longueur
      /[a-z]/.test(password),                 // Minuscule
      /[A-Z]/.test(password),                 // Majuscule
      /\d/.test(password),                    // Chiffre
      /[!@#$%^&*(),.?":{}|<>]/.test(password) // Caractère spécial
    ];

    checks.forEach((check, index) => {
      if (check) {
        score++;
        if (securityDots[index]) {
          securityDots[index].classList.add('active');
        }
      } else {
        if (securityDots[index]) {
          securityDots[index].classList.remove('active');
        }
      }
    });

    // Mettre à jour la barre de force
    if (strengthBar) {
      const percentage = (score / 5) * 100;
      strengthBar.style.width = percentage + '%';
    }

    return score >= 4; // Mot de passe fort si 4/5 critères
  }

  /**
   * 🚪 Gère la déconnexion
   */
  handleLogout() {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler',
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      confirmButtonColor: 'var(--gold-primary)'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performLogout();
      }
    });
  }

  /**
   * 🔓 Effectue la déconnexion
   */
  performLogout() {
    // Nettoyer la session
    this.currentUser = null;
    localStorage.removeItem('aura_session');
    sessionStorage.removeItem('aura_session');

    // Retour à l'écran d'authentification
    const dashboardContainer = document.getElementById('dashboard-container');
    const authContainer = document.getElementById('auth-container');

    if (dashboardContainer) {
      dashboardContainer.classList.remove('active');
    }

    if (authContainer) {
      authContainer.classList.add('active');
    }

    // Message de confirmation
    Swal.fire({
      icon: 'success',
      title: 'Déconnecté',
      text: 'Vous avez été déconnecté avec succès',
      timer: 1500,
      showConfirmButton: false,
      background: 'var(--color-surface)',
      color: 'var(--color-text)'
    });
  }

  /**
   * 💾 Sauvegarde la session
   */
  saveSession(remember = false) {
    const sessionData = {
      username: this.currentUser.username,
      loginTime: Date.now(),
      expiresAt: Date.now() + this.sessionTimeout
    };

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('aura_session', JSON.stringify(sessionData));
  }

  /**
   * 🔄 Restaure la session
   */
  restoreSession() {
    const sessionData = localStorage.getItem('aura_session') || 
                       sessionStorage.getItem('aura_session');

    if (!sessionData) return false;

    try {
      const session = JSON.parse(sessionData);
      
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return false;
      }

      const user = this.users.get(session.username);
      if (user) {
        this.currentUser = user;
        return true;
      }
    } catch (error) {
      console.error('Erreur de restauration de session:', error);
    }

    return false;
  }

  /**
   * 🧹 Nettoie la session
   */
  clearSession() {
    localStorage.removeItem('aura_session');
    sessionStorage.removeItem('aura_session');
  }

  /**
   * ⏰ Configure l'auto-logout
   */
  setupAutoLogout() {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (this.currentUser) {
        inactivityTimer = setTimeout(() => {
          this.performLogout();
          Swal.fire({
            icon: 'warning',
            title: 'Session expirée',
            text: 'Vous avez été déconnecté pour inactivité',
            background: 'var(--color-surface)',
            color: 'var(--color-text)'
          });
        }, this.sessionTimeout);
      }
    };

    // Événements qui réinitialisent le timer
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
  }

  /**
   * 🎯 Transition vers le dashboard
   */
  transitionToDashboard() {
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (authContainer) {
      authContainer.classList.remove('active');
    }

    setTimeout(() => {
      if (dashboardContainer) {
        dashboardContainer.classList.add('active');
        
        // Mettre à jour l'affichage utilisateur
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay && this.currentUser) {
          usernameDisplay.textContent = this.currentUser.username;
        }

        // Initialiser le dashboard
        if (window.AURADashboard) {
          window.AURADashboard.initialize();
        }
      }
    }, 300 * this.phi);
  }

  /**
   * 📊 Collecte des données de connexion
   */
  collectLoginData(user, metadata) {
    const loginData = {
      userId: user.username,
      timestamp: metadata.timestamp,
      userAgent: metadata.userAgent,
      ip: metadata.ip,
      rememberMe: metadata.rememberMe,
      sessionId: this.generateSessionId()
    };

    // Stocker pour analytics (simulation)
    console.log('📊 Données de connexion collectées:', loginData);
    
    // En production, envoyer à un service d'analytics
    // this.sendToAnalytics('login', loginData);
  }

  /**
   * 📝 Collecte des données d'inscription
   */
  collectRegistrationData(user) {
    const registrationData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      organization: user.organization,
      purpose: user.purpose,
      timestamp: user.created,
      userAgent: navigator.userAgent
    };

    // Stocker pour analytics (simulation)
    console.log('📝 Données d\'inscription collectées:', registrationData);
    
    // En production, envoyer à un service d'analytics
    // this.sendToAnalytics('registration', registrationData);
  }

  /**
   * 🛠️ Utilitaires
   */
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isStrongPassword(password) {
    return this.validatePasswordStrength(password);
  }

  generateUserId() {
    return 'USR_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateSessionId() {
    return 'SES_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exposer la classe globalement
window.AURAAuth = AURAAuth;

// Auto-initialisation si pas déjà fait
document.addEventListener('DOMContentLoaded', () => {
  if (!window.AURAAuthInstance) {
    window.AURAAuthInstance = new AURAAuth();
    
    // Vérifier s'il y a une session existante
    if (window.AURAAuthInstance.restoreSession()) {
      window.AURAAuthInstance.transitionToDashboard();
    }
  }
});