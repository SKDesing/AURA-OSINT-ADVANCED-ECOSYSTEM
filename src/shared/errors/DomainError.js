// ============================================
// src/shared/errors/DomainError.js
// Domain-specific error handling
// ============================================

class DomainError extends Error {
  constructor(domain, message, code = null) {
    super(message);
    this.name = 'DomainError';
    this.domain = domain;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = { DomainError };