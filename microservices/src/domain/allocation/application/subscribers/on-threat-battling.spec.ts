import { FakeEmitter } from 'test/events/fake-emitter'
import { makeDanger } from 'test/factories/make-danger'
import { makeHero } from 'test/factories/make-hero'
import { makeRank } from 'test/factories/make-rank'
import { makeThreat } from 'test/factories/make-threat'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { EmitStartBattleData, Emitter } from '../events/emitter'
import { OnThreatBattling } from './on-threat-battling'

let inMemoryRanksRepository: InMemoryRanksRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let inMemoryThreatsRepository: InMemoryThreatsRepository
let emitter: Emitter

let emitterSpy: MockInstance<[EmitStartBattleData], void>

describe('On Threat Battling', () => {
  beforeEach(() => {
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )

    emitter = new FakeEmitter()
    emitterSpy = vi.spyOn(emitter, 'emitStartBattle')

    new OnThreatBattling(emitter)
  })

  it('should send a notification when an threat is battling', async () => {
    const rank = makeRank({ level: 4 })
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: rank.level })
    inMemoryDangersRepository.items.push(danger)

    const hero = makeHero({ rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const status = ThreatStatus.create(ThreatStatusEnum.UNASSIGNED)
    const threat = makeThreat({
      dangerId: danger.id,
      heroId: hero.id,
      status,
      durationTime: 1,
    })

    await inMemoryThreatsRepository.create(threat)

    threat.status = ThreatStatus.create(ThreatStatusEnum.BATTLING)
    await inMemoryThreatsRepository.save(threat)

    await waitFor(() => {
      expect(emitterSpy).toHaveBeenCalled()
    })
  })
})
