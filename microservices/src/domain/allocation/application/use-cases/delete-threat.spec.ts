import { makeThreat } from 'test/factories/make-threat'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'
import { InMemoryThreatsRepository } from 'test/repositories/in-memory-threats-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeleteThreatUseCase } from './delete-threat'

let inMemoryThreatsRepository: InMemoryThreatsRepository
let inMemoryDangersRepository: InMemoryDangersRepository
let sut: DeleteThreatUseCase

describe('Delete Threat Use Case', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    inMemoryThreatsRepository = new InMemoryThreatsRepository(
      inMemoryDangersRepository,
    )
    sut = new DeleteThreatUseCase(inMemoryThreatsRepository)
  })

  it('should be able to delete a threat', async () => {
    const threat = makeThreat()
    inMemoryThreatsRepository.items.push(threat)

    const result = await sut.execute({
      threatId: threat.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to delete a threat that does not exist', async () => {
    const result = await sut.execute({
      threatId: 'non-existent-threat-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
