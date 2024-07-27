import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DangersRepository } from '@/domain/allocation/application/repositories/dangers-repository'
import { HeroesRepository } from '@/domain/allocation/application/repositories/heroes-repository'
import { Hero } from '@/domain/allocation/enterprise/entities/hero'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'

export interface GetHeroNearbyRequestUseCase {
  threat: Threat
}

export type GetHeroNearbyResponseUseCase = Either<
  ResourceNotFoundError,
  { hero: Hero }
>

@Injectable()
export class GetHeroNearbyUseCase {
  constructor(
    private heroesRepository: HeroesRepository,
    private dangerRepository: DangersRepository,
  ) {}

  async execute({
    threat,
  }: GetHeroNearbyRequestUseCase): Promise<GetHeroNearbyResponseUseCase> {
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

    if (!hero) {
      return left(new ResourceNotFoundError())
    }

    return right({ hero })
  }
}
