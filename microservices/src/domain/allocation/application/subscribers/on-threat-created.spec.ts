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
import { Logger } from '../log/logger'
import { ScheduleParams, Scheduler } from '../schedule/scheduler'
import { AllocateHeroToThreatUseCase } from '../use-cases/allocate-hero-to-threat'
import { EndBattleUseCase } from '../use-cases/end-battle'
import { GetHeroNearbyUseCase } from '../use-cases/get-hero-nearby'
import { OnThreatCreated } from './on-threat-created'

let inMemoryRanksRepository: InMemoryRanksRepository
let inMemoryHeroesRepository: InMemoryHeroesRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let inMemoryThreatsRepository: InMemoryThreatsRepository
let getHeroNearby: GetHeroNearbyUseCase
let allocateHeroToThreat: AllocateHeroToThreatUseCase
let endBattle: EndBattleUseCase
let scheduler: Scheduler
let logger: Logger

let schedulerScheduleSpy: MockInstance<[ScheduleParams], void>

describe('On Threat Created', () => {
  beforeEach(() => {
    inMemoryRanksRepository = new InMemoryRanksRepository()
    inMemoryHeroesRepository = new InMemoryHeroesRepository(
      inMemoryRanksRepository,
    )
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )

    getHeroNearby = new GetHeroNearbyUseCase(
      inMemoryHeroesRepository,
      inMemoryDangersRepository,
    )

    allocateHeroToThreat = new AllocateHeroToThreatUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      inMemoryDangersRepository,
      inMemoryRanksRepository,
    )

    logger = new FakeLogger()

    endBattle = new EndBattleUseCase(
      inMemoryThreatsRepository,
      inMemoryHeroesRepository,
      logger,
    )

    scheduler = new FakeScheduler(logger)
    schedulerScheduleSpy = vi.spyOn(scheduler, 'schedule')

    new OnThreatCreated(
      getHeroNearby,
      allocateHeroToThreat,
      endBattle,
      scheduler,
      logger,
    )
  })

  it('should send a notification when an threat is created', async () => {
    const rank = makeRank()
    inMemoryRanksRepository.items.push(rank)

    const danger = makeDanger({ level: rank.level })
    inMemoryDangersRepository.items.push(danger)

    const hero = makeHero({ rankId: rank.id })
    inMemoryHeroesRepository.items.push(hero)

    const status = ThreatStatus.create(ThreatStatusEnum.UNASSIGNED)
    const threat = makeThreat({ dangerId: danger.id, status })

    await inMemoryThreatsRepository.create(threat)

    await waitFor(() => {
      expect(schedulerScheduleSpy).toHaveBeenCalled()
    })
  })
})
