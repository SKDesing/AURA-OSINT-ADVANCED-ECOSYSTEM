// ============================================
// src/core/domain/Incident/ThreatLevel.vo.js
// Value Object for Threat Level calculation
// ============================================

class ThreatLevel {
  constructor(level, factors = {}) {
    this.level = level;
    this.factors = factors;
  }

  static calculate(severity, repeatOffender = false) {
    let level = 'LOW';
    const factors = { severity, repeatOffender };

    if (severity >= 9 || (severity >= 7 && repeatOffender)) {
      level = 'CRITICAL';
    } else if (severity >= 7 || (severity >= 5 && repeatOffender)) {
      level = 'HIGH';
    } else if (severity >= 5) {
      level = 'MEDIUM';
    }

    return new ThreatLevel(level, factors);
  }

  requiresEscalation() {
    return this.level === 'CRITICAL';
  }

  requiresImmedateAction() {
    return ['CRITICAL', 'HIGH'].includes(this.level);
  }
}

module.exports = { ThreatLevel };