import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AllocateHeroToThreatUseCase } from '@/domain/allocation/application/use-cases/allocate-hero-to-threat'
import { ThreatResolvedEvent } from '@/domain/allocation/enterprise/events/threat-resolved-event'

import { Logger } from '../log/logger'
import { Scheduler } from '../schedule/scheduler'
import { EndBattleUseCase } from '../use-cases/end-battle'
import { GetThreatNearbyUseCase } from '../use-cases/get-threat-nearby'

@Injectable()
export class OnThreatResolved implements EventHandler {
  private context = OnThreatResolved.name

  constructor(
    private getThreatNearby: GetThreatNearbyUseCase,
    private allocateHeroToThreat: AllocateHeroToThreatUseCase,
    private endBattle: EndBattleUseCase,
    private scheduler: Scheduler,
    private logger: Logger,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendHeroToMenace.bind(this),
      ThreatResolvedEvent.name,
    )
  }

  private async sendHeroToMenace({
    threat: initialThreat,
  }: ThreatResolvedEvent) {
    const threatResult = await this.getThreatNearby.execute({
      heroId: initialThreat.heroId?.toString() as string, // Threat cannot be resolved without a hero
    })

    if (threatResult.isLeft()) {
      this.logger.log(
        'No threats for the hero are happening right now 😮‍💨',
        this.context,
      )
      return
    }

    const result = await this.allocateHeroToThreat.execute({
      hero: threatResult.value.hero,
      threat: threatResult.value.threat,
    })

    // Rank not suitable for threat (almost impossible)
    if (result.isLeft()) {
      this.logger.error(result.value, this.context)
      return
    }

    const { hero, threat, durationTime } = result.value

    this.logger.log(
      `Hero "${hero.name}" was sent to threat ${threat.id} 😎`,
      this.context,
    )

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
