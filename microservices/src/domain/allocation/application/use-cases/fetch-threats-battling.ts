import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Threat } from '../../enterprise/entities/threat'
import { ThreatsRepository } from '../repositories/threats-repository'

type FetchThreatsBattlingResponseUseCase = Either<null, { threats: Threat[] }>

@Injectable()
export class FetchThreatsBattlingUseCase {
  constructor(private threatsRepository: ThreatsRepository) {}

  async execute(): Promise<FetchThreatsBattlingResponseUseCase> {
    const threats = await this.threatsRepository.fetchThreatsBattling()

    return right({
      threats,
    })
  }
}
