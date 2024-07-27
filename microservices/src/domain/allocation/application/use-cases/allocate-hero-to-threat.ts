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
import { DangersRepository } from '../repositories/dangers-repository'
import { HeroesRepository } from '../repositories/heroes-repository'
import { RanksRepository } from '../repositories/ranks-repository'
import { ThreatsRepository } from '../repositories/threats-repository'
import { RankNotSuitableError } from './errors/rank-not-suitable-error'
import { WrongThreatStatusError } from './errors/wrong-threat-status-error'

export interface AllocateHeroToThreatRequestUseCase {
  hero: Hero
  threat: Threat
}

export type AllocateHeroToThreatResponseUseCase = Either<
  ResourceNotFoundError | WrongThreatStatusError | RankNotSuitableError,
  {
    threat: Threat
    hero: Hero
    durationTime: number
  }
>

@Injectable()
export class AllocateHeroToThreatUseCase {
  constructor(
    private threatsRepository: ThreatsRepository,
    private heroesRepository: HeroesRepository,
    private dangerRepository: DangersRepository,
    private rankRepository: RanksRepository,
  ) {}

  async execute({
    hero,
    threat,
  }: AllocateHeroToThreatRequestUseCase): Promise<AllocateHeroToThreatResponseUseCase> {
    if (!threat.status.isEqual(ThreatStatusEnum.UNASSIGNED)) {
      return left(new WrongThreatStatusError())
    }

    const danger = await this.dangerRepository.findById(
      threat.dangerId.toString(),
    )

    const rank = await this.rankRepository.findById(hero.rankId.toString())

    if (!danger || !rank) {
      return left(new ResourceNotFoundError())
    }

    if (!danger.isSuitableForRank(rank)) {
      return left(new RankNotSuitableError())
    }

    threat.heroId = hero.id
    threat.battleStartedAt = new Date()
    threat.durationTime = danger.duration.time
    threat.status = ThreatStatus.create(ThreatStatusEnum.BATTLING)

    hero.status = HeroStatus.create(HeroStatusEnum.BATTLING)

    await Promise.all([
      this.threatsRepository.save(threat),
      this.heroesRepository.save(hero),
    ])

    return right({ threat, hero, durationTime: danger.duration.time })
  }
}
