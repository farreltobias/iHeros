import { makeDanger } from 'test/factories/make-danger'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import { CreateThreatUseCase } from './create-threat'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let sut: CreateThreatUseCase

describe('Create Threat Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )
    sut = new CreateThreatUseCase(
      inMemoryThreatsRepository,
      inMemoryDangersRepository,
    )
  })

  it('should be able to create a threat', async () => {
    const danger = makeDanger()
    inMemoryDangersRepository.items.push(danger)

    const result = await sut.execute({
      monsterId: 'monster-id',
      dangerId: danger.id.toString(),
      latitude: -5.836597,
      longitude: -35.236007,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryThreatsRepository.items[0]).toEqual(result.value?.threat)
    }
  })
})
