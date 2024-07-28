import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AllocateHeroToThreatUseCase } from '@/domain/allocation/application/use-cases/allocate-hero-to-threat'
import { GetHeroNearbyUseCase } from '@/domain/allocation/application/use-cases/get-hero-nearby'
import { ThreatCreatedEvent } from '@/domain/allocation/enterprise/events/threat-created-event'

import { Emitter } from '../events/emitter'
import { Logger } from '../log/logger'
import { DangersRepository } from '../repositories/dangers-repository'
import { MonstersRepository } from '../repositories/monsters-repository'
import { Scheduler } from '../schedule/scheduler'
import { EndBattleUseCase } from '../use-cases/end-battle'

@Injectable()
export class OnThreatCreated implements EventHandler {
  private context = OnThreatCreated.name

  constructor(
    private getHeroNearby: GetHeroNearbyUseCase,
    private allocateHeroToThreat: AllocateHeroToThreatUseCase,
    private endBattle: EndBattleUseCase,
    private dangersRepository: DangersRepository,
    private monstersRepository: MonstersRepository,
    private scheduler: Scheduler,
    private emitter: Emitter,
    private logger: Logger,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.execute.bind(this), ThreatCreatedEvent.name)
  }

  private async execute({ threat: initialThreat }: ThreatCreatedEvent) {
    const monster = await this.monstersRepository.findById(
      initialThreat.monsterId.toString(),
    )

    if (!monster) {
      this.logger.error('Monster not found', this.context)
      return
    }

    const danger = await this.dangersRepository.findById(
      initialThreat.dangerId.toString(),
    )

    if (!danger) {
      this.logger.error('Danger not found', this.context)
      return
    }

    this.emitter.emitThreat({ threat: initialThreat, monster, danger })

    const heroResult = await this.getHeroNearby.execute({
      threat: initialThreat,
    })

    if (heroResult.isLeft()) {
      this.logger.error('No hero available right now', this.context)
      return
    }

    const result = await this.allocateHeroToThreat.execute({
      hero: heroResult.value.hero,
      threat: initialThreat,
    })

    // Rank not suitable for threat (almost impossible)
    if (result.isLeft()) {
      this.logger.error(result.value, this.context)
      return
    }

    const { hero, threat, durationTime } = result.value

    this.logger.log(`Hero "${hero.name}" was sent to threat 😎`, this.context)

    const handler = async () => {
      const result = await this.endBattle.execute({
        heroId: hero.id.toString(),
      })

      if (result.isLeft()) {
        console.error(result.value)
      }
    }

    const name = `end-battle-${threat.id}`
    const endBattleDate = dayjs().add(durationTime, 'second').toDate()

    return this.scheduler.schedule({ date: endBattleDate, name, handler })
  }
}
