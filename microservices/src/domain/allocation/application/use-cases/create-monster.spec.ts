import { InMemoryMonstersRepository } from 'test/repositories/in-memory-monsters-repository'

import { CreateMonsterUseCase } from './create-monster'

let inMemoryMonstersRepository: InMemoryMonstersRepository
let sut: CreateMonsterUseCase

describe('Create Monster Use Case', () => {
  beforeEach(() => {
    inMemoryMonstersRepository = new InMemoryMonstersRepository()
    sut = new CreateMonsterUseCase(inMemoryMonstersRepository)
  })

  it('should be able to create a monster', async () => {
    const result = await sut.execute({
      name: 'Monster Name',
      description: 'Monster Description',
      photoUrl: 'https://monster-photo-url.com',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryMonstersRepository.items[0]).toEqual(result.value?.monster)
    }
  })
})
