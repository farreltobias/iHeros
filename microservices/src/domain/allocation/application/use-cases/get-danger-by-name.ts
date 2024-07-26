import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Danger } from '../../enterprise/entities/danger'
import { DangersRepository } from '../repositories/dangers-repository'

interface GetDangerByNameRequestUseCase {
  dangerName: string
}

type GetDangerByNameResponseUseCase = Either<
  ResourceNotFoundError,
  { danger: Danger }
>

@Injectable()
export class GetDangerByNameUseCase {
  constructor(private dangersRepository: DangersRepository) {}

  async execute({
    dangerName,
  }: GetDangerByNameRequestUseCase): Promise<GetDangerByNameResponseUseCase> {
    const danger = await this.dangersRepository.findByName(dangerName)

    if (!danger) {
      return left(new ResourceNotFoundError())
    }

    return right({
      danger,
    })
  }
}
