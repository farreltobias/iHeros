import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Hero } from '../../enterprise/entities/hero'
import {
  HeroStatus,
  HeroStatusEnum,
} from '../../enterprise/entities/value-objects/hero-status'
import { HeroesRepository } from '../repositories/heroes-repository'

interface UpdateHeroToUnassignedRequestUseCase {
  heroId: string
}

type UpdateHeroToUnassignedResponseUseCase = Either<
  ResourceNotFoundError,
  { hero: Hero }
>

@Injectable()
export class UpdateHeroToUnassignedUseCase {
  constructor(private heroesRepository: HeroesRepository) {}

  async execute({
    heroId,
  }: UpdateHeroToUnassignedRequestUseCase): Promise<UpdateHeroToUnassignedResponseUseCase> {
    const hero = await this.heroesRepository.findById(heroId)

    if (!hero) {
      return left(new ResourceNotFoundError())
    }

    hero.status = HeroStatus.create(HeroStatusEnum.UNASSIGNED)
    await this.heroesRepository.save(hero)

    return right({
      hero,
    })
  }
}
