import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Threat } from '../../enterprise/entities/threat'
import { Location } from '../../enterprise/entities/value-objects/location'
import {
  ThreatStatus,
  ThreatStatusEnum,
} from '../../enterprise/entities/value-objects/threat-status'
import { DangersRepository } from '../repositories/dangers-repository'
import { ThreatsRepository } from '../repositories/threats-repository'

interface CreateThreatRequestUseCase {
  monsterId: string
  latitude: number
  longitude: number
  dangerId: string
}

type CreateThreatResponseUseCase = Either<
  ResourceNotFoundError,
  { threat: Threat }
>

@Injectable()
export class CreateThreatUseCase {
  constructor(
    private threatsRepository: ThreatsRepository,
    private dangerRepository: DangersRepository,
  ) {}

  async execute({
    dangerId,
    latitude,
    longitude,
    monsterId,
  }: CreateThreatRequestUseCase): Promise<CreateThreatResponseUseCase> {
    const danger = await this.dangerRepository.findById(dangerId)

    if (!danger) {
      return left(new ResourceNotFoundError())
    }

    const threat = Threat.create({
      monsterId: new UniqueEntityID(monsterId),
      dangerId: danger.id,
      status: ThreatStatus.create(ThreatStatusEnum.UNASSIGNED),
      location: new Location({
        lat: latitude,
        lng: longitude,
      }),
    })

    await this.threatsRepository.create(threat)

    return right({ threat })
  }
}
