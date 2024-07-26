import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Monster } from '../../enterprise/entities/monster'
import { MonstersRepository } from '../repositories/monsters-repository'

interface GetOrCreateMonsterRequestUseCase {
  name: string
  description: string
  photoUrl: string
}

type GetOrCreateMonsterResponseUseCase = Either<null, { monster: Monster }>

@Injectable()
export class GetOrCreateMonsterUseCase {
  constructor(private monstersRepository: MonstersRepository) {}

  async execute({
    name,
    description,
    photoUrl,
  }: GetOrCreateMonsterRequestUseCase): Promise<GetOrCreateMonsterResponseUseCase> {
    const monsterFound = await this.monstersRepository.findByName(name)

    if (monsterFound) {
      return right({
        monster: monsterFound,
      })
    }

    const monster = Monster.create({
      name,
      description,
      photoUrl,
    })

    await this.monstersRepository.create(monster)

    return right({
      monster,
    })
  }
}
