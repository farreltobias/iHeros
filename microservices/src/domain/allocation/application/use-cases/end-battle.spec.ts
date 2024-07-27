import { makeHero } from 'test/factories/make-hero'
import { makeThreat } from 'test/factories/make-threat'
import { FakeLogger } from 'test/log/fake-logger'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import {
  HeroStatus,
  HeroStatusEnum,
} from '../../enterprise/entities/value-objects/hero-status'
import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { Logger } from '../log/logger'
import { EndBattleUseCase } from './end-battle'

let inMemoryDangersRepository: InMemoryDangersRepository
let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryRanksRepository: InMemoryRanksRepository
let logger: Logger
let sut: EndBattleUseCase

describe('End Battle Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    logger = new FakeLogger()
    sut = new EndBattleUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      logger,
    )
  })

  it('should be able to end battle', async () => {
    const heroStatus = HeroStatus.create(HeroStatusEnum.BATTLING)
    const hero = makeHero({ status: heroStatus })
    inMemoryHeroesRepository.items.push(hero)

    const threatStatus = ThreatStatus.create(ThreatStatusEnum.BATTLING)
    const threat = makeThreat({
      status: threatStatus,
      durationTime: 300,
      heroId: hero.id,
      battleStartedAt: new Date(),
    })
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({
      heroId: hero.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      hero: expect.objectContaining({
        status: expect.objectContaining({
          value: 'UNASSIGNED',
        }),
      }),
      threat: expect.objectContaining({
        status: expect.objectContaining({
          value: 'RESOLVED',
        }),
      }),
    })
  })
})
