// ============================================
// src/core/domain/Incident/IncidentId.vo.js
// Value Object for Incident ID
// ============================================

const { v4: uuidv4 } = require('uuid');

class IncidentId {
  constructor(value) {
    this.value = value || uuidv4();
    this.validate();
  }

  validate() {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('IncidentId must be a valid string');
    }
  }

  equals(other) {
    return other instanceof IncidentId && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = { IncidentId };