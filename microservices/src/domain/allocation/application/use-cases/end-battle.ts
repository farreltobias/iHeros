import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Hero } from '../../enterprise/entities/hero'
import { Threat } from '../../enterprise/entities/threat'
import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { HeroesRepository } from '../repositories/heroes-repository'
import { ThreatsRepository } from '../repositories/threats-repository'
import { HeroNotInBattleError } from './errors/hero-not-in-battle'
import { WrongThreatStatusError } from './errors/wrong-threat-status-error'

interface EndBattleRequestUseCase {
  heroId: string
}

type EndBattleResponseUseCase = Either<
  ResourceNotFoundError,
  { hero: Hero; threat: Threat }
>

@Injectable()
export class EndBattleUseCase {
  constructor(
    private threatsRepository: ThreatsRepository,
    private heroesRepository: HeroesRepository,
  ) {}

  async execute({
    heroId,
  }: EndBattleRequestUseCase): Promise<EndBattleResponseUseCase> {
    const hero = await this.heroesRepository.findById(heroId)

    if (!hero) {
      return left(new ResourceNotFoundError())
    }

    if (!hero.threatBattlingId) {
      return left(new HeroNotInBattleError())
    }

    const threat = await this.threatsRepository.findById(
      hero.threatBattlingId?.toString() ?? '',
    )

    if (!threat) {
      return left(new ResourceNotFoundError())
    }

    if (!threat.status.isEqual(ThreatStatusEnum.BATTLING)) {
      return left(new WrongThreatStatusError())
    }

    threat.status = ThreatStatus.create(ThreatStatusEnum.RESOLVED)
    await this.threatsRepository.save(threat)

    hero.threatBattlingId = null
    await this.heroesRepository.save(hero)

    return right({ hero, threat })
  }
}