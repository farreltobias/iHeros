import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Monster } from '../../enterprise/entities/monster'
import { MonstersRepository } from '../repositories/monsters-repository'

interface CreateMonsterRequestUseCase {
  name: string
  description: string
  photoUrl: string
}

type CreateMonsterResponseUseCase = Either<null, { monster: Monster }>

@Injectable()
export class CreateMonsterUseCase {
  constructor(private monstersRepository: MonstersRepository) {}

  async execute({
    name,
    description,
    photoUrl,
  }: CreateMonsterRequestUseCase): Promise<CreateMonsterResponseUseCase> {
    const monster = Monster.create({
      name,
      description,
      photoUrl,
    })

    await this.monstersRepository.create(monster)

    return right({ monster })
  }
}
