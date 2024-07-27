import { makeDanger } from 'test/factories/make-danger'
import { makeHero } from 'test/factories/make-hero'
import { makeRank } from 'test/factories/make-rank'
import { makeThreat } from 'test/factories/make-threat'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'

import { GetThreatNearbyUseCase } from './get-threat-nearby'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryRanksRepository: InMemoryRanksRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let sut: GetThreatNearbyUseCase

describe('Get Threat Nearby Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    sut = new GetThreatNearbyUseCase(
      inMemoryHeroesRepository,
      inMemoryThreatsRepository,
      inMemoryRanksRepository,
    )
  })

  it('should be able to get nearest threat by hero location', async () => {
    const rank = makeRank()
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: rank.level })
    inMemoryDangersRepository.items.push(danger)

    const threatLocation = new Location({ lat: 40.749329, lng: -73.967927 })
    const threat = makeThreat({ location: threatLocation, dangerId: danger.id })
    inMemoryThreatsRepository.items.push(threat)

    const nearestThreatLocation = new Location({
      lat: -5.836597,
      lng: -35.236007,
    })
    const nearestThreat = makeThreat({
      location: nearestThreatLocation,
      dangerId: danger.id,
    })
    inMemoryThreatsRepository.items.push(nearestThreat)

    const heroLocation = new Location({ lat: -5.836597, lng: -35.236007 })
    const hero = makeHero({ location: heroLocation, rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const result = await sut.execute({
      heroId: hero.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).not.toEqual({ threat })
    expect(result.value).toEqual({ threat: nearestThreat, hero })
  })

  it('should not be able to get nearest threat without existing rank', async () => {
    const hero = makeHero()
    inMemoryHeroesRepository.items.push(hero)

    const result = await sut.execute({
      heroId: hero.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
