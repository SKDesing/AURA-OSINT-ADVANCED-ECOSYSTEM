// ============================================
// src/core/application/commands/CreateIncident/CreateIncidentHandler.js
// CQRS Command Handler
// ============================================

const { Incident } = require('../../../domain/Incident/Incident.entity');

class CreateIncidentHandler {
  constructor(incidentRepository, userRepository, eventBus, logger) {
    this.incidentRepository = incidentRepository;
    this.userRepository = userRepository;
    this.eventBus = eventBus;
    this.logger = logger;
  }

  async execute(command) {
    this.logger.info('CreateIncidentHandler.execute', { command });

    // 1. Validate command
    await command.validate();

    // 2. Check users exist
    const [aggressor, victim] = await Promise.all([
      this.userRepository.findById(command.aggressorUserId),
      this.userRepository.findById(command.victimUserId),
    ]);

    if (!aggressor) {
      throw new Error('Aggressor user not found');
    }
    if (!victim) {
      throw new Error('Victim user not found');
    }

    // 3. Create incident (domain logic)
    const incident = new Incident({
      aggressorUserId: command.aggressorUserId,
      victimUserId: command.victimUserId,
      platform: command.platform,
      severity: command.severity,
      description: command.description,
      capturedAt: command.capturedAt,
      evidence: command.evidence,
      repeatOffender: await this.#isRepeatOffender(command.aggressorUserId),
    });

    // 4. Persist
    await this.incidentRepository.save(incident);

    // 5. Publish domain events
    const events = incident.getDomainEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
    incident.clearDomainEvents();

    // 6. Audit log
    this.logger.info('Incident created', {
      incidentId: incident.id.value,
      severity: incident.severity,
      threatLevel: incident.threatLevel,
    });

    return incident;
  }

  async #isRepeatOffender(userId) {
    const count = await this.incidentRepository.countByAggressor(userId);
    return count >= 3;
  }
}

module.exports = { CreateIncidentHandler };