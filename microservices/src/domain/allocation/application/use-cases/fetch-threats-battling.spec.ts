import { makeThreat } from 'test/factories/make-threat'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { FetchThreatsBattlingUseCase } from './fetch-threats-battling'

let inMemoryDangersRepository: InMemoryDangersRepository
let inMemoryThreatsRepository: InMemoryThreatsRepository
let sut: FetchThreatsBattlingUseCase

describe('Fetch Threats Battling Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )
    sut = new FetchThreatsBattlingUseCase(inMemoryThreatsRepository)
  })

  it('should be able to fetch threats battling', async () => {
    const threatNotIncluded = makeThreat({
      status: ThreatStatus.create(ThreatStatusEnum.UNASSIGNED),
    })

    const threat = makeThreat({
      status: ThreatStatus.create(ThreatStatusEnum.BATTLING),
    })

    inMemoryThreatsRepository.items.push(threat, threatNotIncluded)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      threats: [threat],
    })
  })
})
