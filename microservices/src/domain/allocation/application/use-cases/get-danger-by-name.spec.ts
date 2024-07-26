import { makeDanger } from 'test/factories/make-danger'
import { InMemoryDangersRepository } from 'test/repositories/in-memory-dangers-repository'

import { GetDangerByNameUseCase } from './get-danger-by-name'

let inMemoryDangersRepository: InMemoryDangersRepository
let sut: GetDangerByNameUseCase

describe('Get Danger By name', () => {
  beforeEach(() => {
    inMemoryDangersRepository = new InMemoryDangersRepository()
    sut = new GetDangerByNameUseCase(inMemoryDangersRepository)
  })

  it('should be able to get a danger by name', async () => {
    const danger = makeDanger()
    inMemoryDangersRepository.items.push(danger)

    const result = await sut.execute({
      dangerName: danger.name,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      danger: expect.objectContaining({
        name: danger.name,
      }),
    })
  })
})
