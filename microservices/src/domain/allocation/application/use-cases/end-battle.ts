import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Hero } from '../../enterprise/entities/hero'
import { Threat } from '../../enterprise/entities/threat'
import {
  HeroStatus,
  HeroStatusEnum,
} from '../../enterprise/entities/value-objects/hero-status'
import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { Logger } from '../log/logger'
import { HeroesRepository } from '../repositories/heroes-repository'
import { ThreatsRepository } from '../repositories/threats-repository'
import { HeroNotInBattleError } from './errors/hero-not-in-battle'
import { WrongThreatStatusError } from './errors/wrong-threat-status-error'

export interface EndBattleRequestUseCase {
  heroId: string
}

export type EndBattleResponseUseCase = Either<
  ResourceNotFoundError | HeroNotInBattleError | WrongThreatStatusError,
  { hero: Hero; threat: Threat }
>

@Injectable()
export class EndBattleUseCase {
  private context = EndBattleUseCase.name

  constructor(
    private threatsRepository: ThreatsRepository,
    private heroesRepository: HeroesRepository,
    private logger: Logger,
  ) {}

  async execute({
    heroId,
  }: EndBattleRequestUseCase): Promise<EndBattleResponseUseCase> {
    const hero = await this.heroesRepository.findById(heroId)

    if (!hero) {
      return left(new ResourceNotFoundError())
    }

    if (!hero.status.isEqual(HeroStatusEnum.BATTLING)) {
      return left(new HeroNotInBattleError())
    }

    const threat = await this.threatsRepository.findByHeroId(hero.id.toString())

    if (!threat) {
      return left(new ResourceNotFoundError())
    }

    if (!threat.status.isEqual(ThreatStatusEnum.BATTLING)) {
      return left(new WrongThreatStatusError())
    }

    threat.status = ThreatStatus.create(ThreatStatusEnum.RESOLVED)
    await this.threatsRepository.save(threat)

    hero.status = HeroStatus.create(HeroStatusEnum.UNASSIGNED)
    await this.heroesRepository.save(hero)

    this.logger.log(`Battle ended for hero ${hero.name} 🏆`, this.context)

    return right({ hero, threat })
  }
}
