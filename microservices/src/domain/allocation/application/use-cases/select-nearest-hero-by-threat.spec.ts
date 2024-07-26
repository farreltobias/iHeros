import { makeDanger } from 'test/factories/make-danger'
import { makeHero } from 'test/factories/make-hero'
import { makeThreat } from 'test/factories/make-threat'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Location } from '../../enterprise/entities/value-objects/location'
import { SelectNearestHeroByThreatUseCase } from './select-nearest-hero-by-threat'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryRanksRepository: InMemoryRanksRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let sut: SelectNearestHeroByThreatUseCase

describe('Select Nearest Hero by Threat Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository()
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    sut = new SelectNearestHeroByThreatUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      inMemoryDangersRepository,
    )
  })

  it('should be able to get nearest hero by threat location', async () => {
    const heroLocation = new Location({ lat: 40.749329, lng: -73.967927 })
    const hero = makeHero({ location: heroLocation })
    inMemoryHeroesRepository.items.push(hero)

    const nearestHeroLocation = new Location({
      lat: -5.836597,
      lng: -35.236007,
    })
    const nearestHero = makeHero({ location: nearestHeroLocation })
    inMemoryHeroesRepository.items.push(nearestHero)

    const danger = makeDanger()
    inMemoryDangersRepository.items.push(danger)

    const threatLocation = new Location({ lat: -5.836597, lng: -35.236007 })
    const threat = makeThreat({ location: threatLocation, dangerId: danger.id })
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({
      threatId: threat.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).not.toEqual({ hero })
    expect(result.value).toEqual({ hero: nearestHero })
  })

  it('should not be able to get nearest hero by threat that does not exist', async () => {
    const result = await sut.execute({
      threatId: 'invalid-threat-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
