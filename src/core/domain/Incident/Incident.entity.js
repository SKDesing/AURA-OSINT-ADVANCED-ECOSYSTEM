class Incident {
  constructor(data) {
    this.id = `incident_${Date.now()}`;
    this.aggressorUserId = data.aggressorUserId;
    this.victimUserId = data.victimUserId;
    this.platform = data.platform;
    this.severity = data.severity;
    this.description = data.description;
    this.capturedAt = data.capturedAt;
    this.status = 'PENDING_REVIEW';
    this.threatLevel = this.severity >= 8 ? 'HIGH' : this.severity >= 5 ? 'MEDIUM' : 'LOW';
  }

  confirm() {
    this.status = 'CONFIRMED';
  }

  escalateToAuthorities() {
    this.status = 'ESCALATED';
  }
}

module.exports = { Incident };