import { makeHero } from 'test/factories/make-hero'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'

import {
  HeroStatus,
  HeroStatusEnum,
} from '../../enterprise/entities/value-objects/hero-status'
import { UpdateHeroToUnassignedUseCase } from './update-hero-to-unassigned'

let inMemoryRanksRepository: InMemoryRanksRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let sut: UpdateHeroToUnassignedUseCase

describe('Fetch Heroes Battling Use Case', () => {
  beforeEach(() => {
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    sut = new UpdateHeroToUnassignedUseCase(inMemoryHeroesRepository)
  })

  it('should be able to fetch heroes battling', async () => {
    const hero = makeHero({
      status: HeroStatus.create(HeroStatusEnum.BATTLING),
    })

    inMemoryHeroesRepository.items.push(hero)

    const result = await sut.execute({
      heroId: hero.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      hero: expect.objectContaining({
        id: hero.id,
        status: expect.objectContaining({
          value: HeroStatusEnum.UNASSIGNED,
        }),
      }),
    })
  })
})
