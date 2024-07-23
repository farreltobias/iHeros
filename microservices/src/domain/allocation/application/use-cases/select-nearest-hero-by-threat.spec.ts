import { makeHero } from 'test/factories/make-hero'
import { makeThreat } from 'test/factories/make-threat'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Location } from '../../enterprise/entities/value-objects/location'
import { SelectNearestHeroByThreatUseCase } from './select-nearest-hero-by-threat'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let sut: SelectNearestHeroByThreatUseCase

describe('Select Nearest Hero by Threat Use Case', () => {
  beforeEach(() => {
    inMemoryThreatsRepository = new InMemoryThreatsRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository()
    sut = new SelectNearestHeroByThreatUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
    )
  })

  it('should be able to get nearest hero by threat location', async () => {
    const heroLocation = new Location({ lat: 40.749329, lng: -73.967927 })
    const hero = makeHero({ baseLocation: heroLocation })

    inMemoryHeroesRepository.items.push(hero)

    const nearestHeroLocation = new Location({
      lat: -5.836597,
      lng: -35.236007,
    })
    const nearestHero = makeHero({ baseLocation: nearestHeroLocation })

    inMemoryHeroesRepository.items.push(nearestHero)

    const threatLocation = new Location({ lat: -5.836597, lng: -35.236007 })
    const threat = makeThreat({ location: threatLocation })

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
