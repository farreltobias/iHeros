import { makeHero } from 'test/factories/make-hero'
import { makeThreat } from 'test/factories/make-threat'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { EndBattleUseCase } from './end-battle'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let sut: EndBattleUseCase

describe('End Battle Use Case', () => {
  beforeEach(() => {
    inMemoryThreatsRepository = new InMemoryThreatsRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository()
    sut = new EndBattleUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
    )
  })

  it('should be able to end battle', async () => {
    const status = ThreatStatus.create(ThreatStatusEnum.BATTLING)
    const threat = makeThreat({ status, durationTime: 300 })
    inMemoryThreatsRepository.items.push(threat)

    const hero = makeHero({ threatBattlingId: threat.id })
    inMemoryHeroesRepository.items.push(hero)

    const result = await sut.execute({
      heroId: hero.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      hero: expect.objectContaining({
        threatBattlingId: null,
      }),
      threat: expect.objectContaining({
        status: expect.objectContaining({
          value: 'RESOLVED',
        }),
      }),
    })
  })
})
