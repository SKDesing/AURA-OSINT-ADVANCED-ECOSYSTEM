// ============================================
// src/core/domain/Incident/Incident.entity.js
// Pure domain logic - No dependencies
// ============================================

const { IncidentId } = require('./IncidentId.vo');
const { Severity } = require('./Severity.vo');
const { ThreatLevel } = require('./ThreatLevel.vo');
const { DomainError } = require('../../../shared/errors/DomainError');

class Incident {
  #id;
  #aggressorUserId;
  #victimUserId;
  #platform;
  #severity;
  #threatLevel;
  #description;
  #capturedAt;
  #evidence;
  #status;
  #createdAt;
  #updatedAt;
  #domainEvents = [];

  constructor(props) {
    this.#validate(props);
    
    this.#id = props.id instanceof IncidentId ? props.id : new IncidentId(props.id);
    this.#aggressorUserId = props.aggressorUserId;
    this.#victimUserId = props.victimUserId;
    this.#platform = props.platform;
    this.#severity = Severity.fromValue(props.severity);
    this.#threatLevel = ThreatLevel.calculate(props.severity, props.repeatOffender);
    this.#description = props.description;
    this.#capturedAt = props.capturedAt;
    this.#evidence = props.evidence || [];
    this.#status = props.status || 'PENDING_REVIEW';
    this.#createdAt = props.createdAt || new Date();
    this.#updatedAt = props.updatedAt || new Date();
  }

  // ========================================
  // BUSINESS LOGIC (Domain Rules)
  // ========================================

  confirm() {
    if (this.#severity.value < 7) {
      throw new DomainError(
        'Incident.confirm',
        'Cannot confirm incident with severity < 7'
      );
    }

    if (this.#status === 'CONFIRMED') {
      throw new DomainError('Incident.confirm', 'Incident already confirmed');
    }

    this.#status = 'CONFIRMED';
    this.#updatedAt = new Date();
    
    this.addDomainEvent({
      type: 'IncidentConfirmed',
      incidentId: this.#id,
      aggressorUserId: this.#aggressorUserId,
      severity: this.#severity.value,
      confirmedAt: this.#updatedAt,
    });
  }

  escalateToAuthorities() {
    if (this.#threatLevel.level !== 'CRITICAL') {
      throw new DomainError(
        'Incident.escalate',
        'Only CRITICAL threats can be escalated'
      );
    }

    this.#status = 'ESCALATED';
    this.#updatedAt = new Date();
    
    this.addDomainEvent({
      type: 'IncidentEscalated',
      incidentId: this.#id,
      escalatedAt: this.#updatedAt,
    });
  }

  addEvidence(evidence) {
    if (this.#evidence.length >= 50) {
      throw new DomainError('Incident.addEvidence', 'Max 50 evidence per incident');
    }

    this.#evidence.push(evidence);
    this.#updatedAt = new Date();
  }

  calculateForensicScore() {
    const weights = {
      evidenceQuality: 0.4,
      multipleSources: 0.3,
      timelineConsistency: 0.2,
      metadataIntegrity: 0.1,
    };

    const evidenceQuality = this.#calculateEvidenceQuality();
    const multipleSources = this.#evidence.length > 3 ? 1 : 0.5;
    const timelineConsistency = this.#checkTimelineConsistency();
    const metadataIntegrity = this.#verifyMetadataIntegrity();

    const score = 
      evidenceQuality * weights.evidenceQuality +
      multipleSources * weights.multipleSources +
      timelineConsistency * weights.timelineConsistency +
      metadataIntegrity * weights.metadataIntegrity;

    return Math.round(score * 100);
  }

  // ========================================
  // GETTERS (Read-only access)
  // ========================================

  get id() { return this.#id; }
  get aggressorUserId() { return this.#aggressorUserId; }
  get victimUserId() { return this.#victimUserId; }
  get severity() { return this.#severity.value; }
  get threatLevel() { return this.#threatLevel.level; }
  get status() { return this.#status; }
  get evidence() { return [...this.#evidence]; }

  // ========================================
  // PRIVATE METHODS
  // ========================================

  #validate(props) {
    if (!props.aggressorUserId) {
      throw new DomainError('Incident', 'Aggressor user ID required');
    }
    if (!props.platform) {
      throw new DomainError('Incident', 'Platform required');
    }
    if (props.severity < 1 || props.severity > 10) {
      throw new DomainError('Incident', 'Severity must be between 1-10');
    }
  }

  #calculateEvidenceQuality() {
    if (this.#evidence.length === 0) return 0;
    
    const qualityScores = this.#evidence.map(e => e.qualityScore || 0.5);
    return qualityScores.reduce((sum, s) => sum + s, 0) / qualityScores.length;
  }

  #checkTimelineConsistency() {
    return 0.85; // Simplified
  }

  #verifyMetadataIntegrity() {
    return 0.95; // Simplified
  }

  // ========================================
  // DOMAIN EVENTS
  // ========================================

  addDomainEvent(event) {
    this.#domainEvents.push(event);
  }

  getDomainEvents() {
    return [...this.#domainEvents];
  }

  clearDomainEvents() {
    this.#domainEvents = [];
  }

  // ========================================
  // PERSISTENCE
  // ========================================

  toPersistence() {
    return {
      id: this.#id.value,
      aggressor_user_id: this.#aggressorUserId,
      victim_user_id: this.#victimUserId,
      platform: this.#platform,
      severity: this.#severity.value,
      threat_level: this.#threatLevel.level,
      description: this.#description,
      captured_at: this.#capturedAt,
      evidence: JSON.stringify(this.#evidence),
      status: this.#status,
      created_at: this.#createdAt,
      updated_at: this.#updatedAt,
    };
  }

  static fromPersistence(data) {
    return new Incident({
      id: data.id,
      aggressorUserId: data.aggressor_user_id,
      victimUserId: data.victim_user_id,
      platform: data.platform,
      severity: data.severity,
      description: data.description,
      capturedAt: data.captured_at,
      evidence: JSON.parse(data.evidence || '[]'),
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}

module.exports = { Incident };