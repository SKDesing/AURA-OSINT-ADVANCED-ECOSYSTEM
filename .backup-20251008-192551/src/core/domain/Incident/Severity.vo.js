// ============================================
// src/core/domain/Incident/Severity.vo.js
// Value Object for Incident Severity
// ============================================

class Severity {
  constructor(value) {
    this.value = value;
    this.validate();
  }

  static fromValue(value) {
    return new Severity(value);
  }

  validate() {
    if (typeof this.value !== 'number' || this.value < 1 || this.value > 10) {
      throw new Error('Severity must be a number between 1 and 10');
    }
  }

  get level() {
    if (this.value >= 9) return 'CRITICAL';
    if (this.value >= 7) return 'HIGH';
    if (this.value >= 5) return 'MEDIUM';
    if (this.value >= 3) return 'LOW';
    return 'MINIMAL';
  }

  equals(other) {
    return other instanceof Severity && this.value === other.value;
  }
}

module.exports = { Severity };