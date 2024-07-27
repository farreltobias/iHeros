import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Hero } from '../../enterprise/entities/hero'
import { Threat } from '../../enterprise/entities/threat'
import { HeroesRepository } from '../repositories/heroes-repository'
import { RanksRepository } from '../repositories/ranks-repository'
import { ThreatsRepository } from '../repositories/threats-repository'

export interface GetThreatNearbyRequestUseCase {
  heroId: string
}

export type GetThreatNearbyResponseUseCase = Either<
  ResourceNotFoundError,
  {
    threat: Threat
    hero: Hero
  }
>

@Injectable()
export class GetThreatNearbyUseCase {
  constructor(
    private heroesRepository: HeroesRepository,
    private threatsRepository: ThreatsRepository,
    private rankRepository: RanksRepository,
  ) {}

  async execute({
    heroId,
  }: GetThreatNearbyRequestUseCase): Promise<GetThreatNearbyResponseUseCase> {
    const hero = await this.heroesRepository.findById(heroId)

    if (!hero) {
      return left(new ResourceNotFoundError())
    }

    const rank = await this.rankRepository.findById(hero.rankId.toString())

    if (!rank) {
      return left(new ResourceNotFoundError())
    }

    const threat = await this.threatsRepository.findNearby(
      hero.location,
      rank.level,
    )

    if (!threat) {
      return left(new ResourceNotFoundError())
    }

    return right({ threat, hero })
  }
}
