import { makeDanger } from 'test/factories/make-danger'
import { makeHero } from 'test/factories/make-hero'
import { makeRank } from 'test/factories/make-rank'
import { makeThreat } from 'test/factories/make-threat'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { AllocateHeroToThreatUseCase } from './allocate-hero-to-threat'
import { RankNotSuitableError } from './errors/rank-not-suitable-error'
import { WrongThreatStatusError } from './errors/wrong-threat-status-error'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let inMemoryRanksRepository: InMemoryRanksRepository
let sut: AllocateHeroToThreatUseCase

describe('Allocate Hero to Threat Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    sut = new AllocateHeroToThreatUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      inMemoryDangersRepository,
      inMemoryRanksRepository,
    )
  })

  it('should be able to get allocate hero to threat', async () => {
    const rank = makeRank()
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: rank.level })
    inMemoryDangersRepository.items.push(danger)

    const hero = makeHero({ rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const threat = makeThreat({ dangerId: danger.id })
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({ threat, hero })

    expect(result.isRight()).toBe(true) // garantes condition below
    expect(result.value).toEqual({
      durationTime: expect.any(Number),
      hero: expect.objectContaining({
        status: expect.objectContaining({
          value: 'BATTLING',
        }),
      }),
      threat: expect.objectContaining({
        battleStartedAt: expect.any(Date),
        durationTime: expect.any(Number),
        status: expect.objectContaining({
          value: 'BATTLING',
        }),
      }),
    })

    if (result.isRight()) {
      const duration = danger.duration.toValue()
      expect(result.value.threat.durationTime).toBeGreaterThanOrEqual(
        duration.min,
      )
      expect(result.value.threat.durationTime).toBeLessThanOrEqual(duration.max)
    }
  })

  it('should not be able to allocate hero to threat with danger that does not exist', async () => {
    const hero = makeHero()
    inMemoryHeroesRepository.items.push(hero)

    const threat = makeThreat()
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({ threat, hero })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to allocate hero with threat already in battle', async () => {
    const rank = makeRank()
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: rank.level })
    inMemoryDangersRepository.items.push(danger)

    const hero = makeHero({ rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const status = ThreatStatus.create(ThreatStatusEnum.BATTLING)
    const threat = makeThreat({ dangerId: danger.id, status })
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({ threat, hero })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(WrongThreatStatusError)
    }
  })

  it('should not be able to allocate hero with invalid rank to threat', async () => {
    const rank = makeRank({ level: 4 })
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: 1 })
    inMemoryDangersRepository.items.push(danger)

    const hero = makeHero({ rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const threat = makeThreat({ dangerId: danger.id })
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({ threat, hero })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RankNotSuitableError)
    }
  })
})
