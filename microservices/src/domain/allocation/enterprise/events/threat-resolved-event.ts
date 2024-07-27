import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Threat } from '../entities/threat'

export class ThreatResolvedEvent implements DomainEvent {
  public ocurredAt: Date
  public threat: Threat

  constructor(threat: Threat) {
    this.threat = threat
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.threat.id
  }
}
