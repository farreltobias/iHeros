import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ThreatBattlingEvent } from '@/domain/allocation/enterprise/events/threat-battling-event'

import { Emitter } from '../events/emitter'

@Injectable()
export class OnThreatBattling implements EventHandler {
  constructor(private emitter: Emitter) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.execute.bind(this), ThreatBattlingEvent.name)
  }

  private async execute({ threat }: ThreatBattlingEvent) {
    this.emitter.emitStartBattle({ threat })
  }
}
