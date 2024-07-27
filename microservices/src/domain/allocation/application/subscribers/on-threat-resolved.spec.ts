import { FakeEmitter } from 'test/events/fake-emitter'
import { makeDanger } from 'test/factories/make-danger'
import { makeHero } from 'test/factories/make-hero'
import { makeRank } from 'test/factories/make-rank'
import { makeThreat } from 'test/factories/make-threat'
import { FakeLogger } from 'test/log/fake-logger'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryHeroesRepository } from 'test/repositories/in-memory-heroes-repository'
import { InMemoryRanksRepository } from 'test/repositories/in-memory-ranks-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'
import { FakeScheduler } from 'test/schedule/fake-scheduler'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { EmitEndBattleData, Emitter } from '../events/emitter'
import { Logger } from '../log/logger'
import { ScheduleParams, Scheduler } from '../schedule/scheduler'
import { AllocateHeroToThreatUseCase } from '../use-cases/allocate-hero-to-threat'
import { EndBattleUseCase } from '../use-cases/end-battle'
import { GetThreatNearbyUseCase } from '../use-cases/get-threat-nearby'
import { OnThreatResolved } from './on-threat-resolved'

let inMemoryRanksRepository: InMemoryRanksRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let inMemoryThreatsRepository: InMemoryThreatsRepository
let getThreatNearby: GetThreatNearbyUseCase
let allocateHeroToThreat: AllocateHeroToThreatUseCase
let endBattle: EndBattleUseCase
let emitter: Emitter
let scheduler: Scheduler
let logger: Logger

let emitterSpy: MockInstance<[EmitEndBattleData], void>
let schedulerScheduleSpy: MockInstance<[ScheduleParams], void>

describe('On Threat Resolved', () => {
  beforeEach(() => {
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )

    getThreatNearby = new GetThreatNearbyUseCase(
      inMemoryHeroesRepository,
      inMemoryThreatsRepository,
      inMemoryRanksRepository,
    )

    allocateHeroToThreat = new AllocateHeroToThreatUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      inMemoryDangersRepository,
      inMemoryRanksRepository,
    )

    emitter = new FakeEmitter()

    logger = new FakeLogger()

    endBattle = new EndBattleUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      logger,
    )

    scheduler = new FakeScheduler(logger)

    schedulerScheduleSpy = vi.spyOn(scheduler, 'schedule')
    emitterSpy = vi.spyOn(emitter, 'emitEndBattle')

    new OnThreatResolved(
      getThreatNearby,
      allocateHeroToThreat,
      endBattle,
      scheduler,
      logger,
      emitter,
    )
  })

  it('should send a notification when an threat is resolved', async () => {
    const rank = makeRank({ level: 4 })
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: rank.level })
    inMemoryDangersRepository.items.push(danger)

    const hero = makeHero({ rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const status = ThreatStatus.create(ThreatStatusEnum.BATTLING)
    const threat = makeThreat({
      dangerId: danger.id,
      heroId: hero.id,
      status,
      durationTime: 1,
    })

    await inMemoryThreatsRepository.create(threat)

    const nextThreat = makeThreat({
      dangerId: danger.id,
      status: ThreatStatus.create(ThreatStatusEnum.UNASSIGNED),
    })

    await inMemoryThreatsRepository.create(nextThreat)

    threat.status = ThreatStatus.create(ThreatStatusEnum.RESOLVED)
    await inMemoryThreatsRepository.save(threat)

    await waitFor(() => {
      expect(emitterSpy).toHaveBeenCalled()
      expect(schedulerScheduleSpy).toHaveBeenCalled()
    })
  })
})
