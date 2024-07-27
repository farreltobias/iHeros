import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { ThreatsRepository } from '../repositories/threats-repository'

interface DeleteThreatRequestUseCase {
  threatId: string
}

type DeleteThreatResponseUseCase = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteThreatUseCase {
  constructor(private threatsRepository: ThreatsRepository) {}

  async execute({
    threatId,
  }: DeleteThreatRequestUseCase): Promise<DeleteThreatResponseUseCase> {
    const threat = await this.threatsRepository.findById(threatId)

    if (!threat) {
      return left(new ResourceNotFoundError())
    }

    await this.threatsRepository.delete(threat)

    return right(null)
  }
}
