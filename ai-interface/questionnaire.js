const prompts = require('./prompts');

class DynamicQuestionnaire {
  constructor(context) {
    this.context = context;
    this.questions = [];
    this.responses = {};
  }

  generateQuestions() {
    this.questions = [];

    if (!this.context.type || this.context.confidence < 0.7) {
      this.questions.push({
        id: 'investigation_type',
        type: 'choice',
        question: prompts.INVESTIGATION_TYPE,
        choices: [
          { value: 'person', label: '👤 Personne (username, email, nom)' },
          { value: 'organization', label: '🏢 Organisation (domain, société)' },
          { value: 'phone', label: '📱 Numéro de téléphone' },
          { value: 'technical', label: '🔧 Technique (IP, serveur)' }
        ],
        required: true
      });
    }

    if (this.context.type === 'person' || this.needsTypeConfirmation()) {
      this.addPersonQuestions();
    }
    
    if (this.context.type === 'organization' || this.needsTypeConfirmation()) {
      this.addOrganizationQuestions();
    }

    if (this.context.type === 'phone' || this.needsTypeConfirmation()) {
      this.addPhoneQuestions();
    }

    this.questions.push({
      id: 'confirm',
      type: 'confirm',
      question: prompts.CONFIRM_INVESTIGATION,
      required: true
    });

    return this.questions;
  }

  addPersonQuestions() {
    if (!this.context.availableData.username) {
      this.questions.push({
        id: 'username',
        type: 'input',
        question: '👤 Username / Pseudo (ex: elonmusk):',
        required: false,
        validator: (value) => {
          if (!value) return { valid: true };
          return {
            valid: /^[a-zA-Z0-9_-]{3,}$/.test(value),
            error: 'Username invalide (min 3 caractères alphanumériques)'
          };
        }
      });
    }

    if (!this.context.availableData.email) {
      this.questions.push({
        id: 'email',
        type: 'input',
        question: '📧 Email (ex: user@example.com):',
        required: false,
        validator: (value) => {
          if (!value) return { valid: true };
          return {
            valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            error: 'Email invalide'
          };
        }
      });
    }
  }

  addOrganizationQuestions() {
    if (!this.context.availableData.domain) {
      this.questions.push({
        id: 'domain',
        type: 'input',
        question: '🌐 Nom de domaine (ex: example.com):',
        required: false,
        validator: (value) => {
          if (!value) return { valid: true };
          return {
            valid: /^[a-z0-9-]+\.[a-z]{2,}$/i.test(value),
            error: 'Domaine invalide'
          };
        }
      });
    }
  }

  addPhoneQuestions() {
    if (!this.context.availableData.phone) {
      this.questions.push({
        id: 'phone',
        type: 'input',
        question: '📱 Numéro de téléphone (format international):',
        required: false,
        validator: (value) => {
          if (!value) return { valid: true };
          return {
            valid: /^\+?[0-9]{10,15}$/.test(value),
            error: 'Numéro invalide (10-15 chiffres)'
          };
        }
      });
    }
  }

  needsTypeConfirmation() {
    return !this.context.type || this.context.confidence < 0.5;
  }

  recordResponse(questionId, answer) {
    this.responses[questionId] = answer;
    return this.validateResponse(questionId, answer);
  }

  validateResponse(questionId, answer) {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return { valid: false, error: 'Question inconnue' };

    if (question.required && !answer) {
      return { valid: false, error: 'Cette réponse est requise' };
    }

    if (question.validator) {
      return question.validator(answer);
    }

    return { valid: true };
  }

  compileInvestigationData() {
    const data = { ...this.context.availableData };

    for (const [key, value] of Object.entries(this.responses)) {
      if (value && key !== 'confirm' && key !== 'investigation_type') {
        data[key] = value;
      }
    }

    if (this.responses.investigation_type) {
      this.context.type = this.responses.investigation_type;
    }

    return {
      type: this.context.type,
      inputs: data,
      confirmed: true
    };
  }
}

module.exports = DynamicQuestionnaire;
