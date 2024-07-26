import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Hero } from '../../enterprise/entities/hero'
import { DangersRepository } from '../repositories/dangers-repository'
import { HeroesRepository } from '../repositories/heroes-repository'
import { ThreatsRepository } from '../repositories/threats-repository'

interface SelectNearestHeroByThreatRequestUseCase {
  threatId: string
}

type SelectNearestHeroByThreatResponseUseCase = Either<
  ResourceNotFoundError,
  { hero: Hero | null }
>

@Injectable()
export class SelectNearestHeroByThreatUseCase {
  constructor(
    private threatsRepository: ThreatsRepository,
    private heroesRepository: HeroesRepository,
    private dangerRepository: DangersRepository,
  ) {}

  async execute({
    threatId,
  }: SelectNearestHeroByThreatRequestUseCase): Promise<SelectNearestHeroByThreatResponseUseCase> {
    const threat = await this.threatsRepository.findById(threatId)

    if (!threat) {
      return left(new ResourceNotFoundError())
    }

    const danger = await this.dangerRepository.findById(
      threat.dangerId.toString(),
    )

    if (!danger) {
      return left(new ResourceNotFoundError())
    }

    const [hero] = await this.heroesRepository.findManyNearby({
      location: threat.location,
      threatLevel: danger.level,
      page: 1,
    })

    return right({ hero })
  }
}
