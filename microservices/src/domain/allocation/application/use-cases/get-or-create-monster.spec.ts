import { makeMonster } from 'test/factories/make-monster'
import { InMemoryMonstersRepository } from 'test/repositories/in-memory-monsters-repository'

import { GetOrCreateMonsterUseCase } from './get-or-create-monster'

let inMemoryMonstersRepository: InMemoryMonstersRepository
let sut: GetOrCreateMonsterUseCase

describe('Get Monster By name', () => {
  beforeEach(() => {
    inMemoryMonstersRepository = new InMemoryMonstersRepository()
    sut = new GetOrCreateMonsterUseCase(inMemoryMonstersRepository)
  })

  it('should be able to get a monster by name', async () => {
    const monster = makeMonster()
    inMemoryMonstersRepository.items.push(monster)

    const result = await sut.execute({
      name: monster.name,
      description: monster.description,
      photoUrl: monster.photoUrl,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      monster: expect.objectContaining({
        name: monster.name,
      }),
    })
  })

  it('should be able to create a monster with information', async () => {
    const result = await sut.execute({
      name: 'Monster Name',
      description: 'Monster Description',
      photoUrl: 'https://via.placeholder.com/300',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      monster: expect.objectContaining({
        name: 'Monster Name',
      }),
    })
  })
})
