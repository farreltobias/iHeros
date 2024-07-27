import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { io, Socket } from 'socket.io-client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateThreatUseCase } from '@/domain/allocation/application/use-cases/create-threat'
import { DeleteThreatUseCase } from '@/domain/allocation/application/use-cases/delete-threat'
import { FetchThreatsBattlingUseCase } from '@/domain/allocation/application/use-cases/fetch-threats-battling'
import { UpdateHeroToUnassignedUseCase } from '@/domain/allocation/application/use-cases/update-hero-to-unassigned'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class SocketClientProvider implements OnModuleInit, OnModuleDestroy {
  private incomingThreatsSocket?: Socket

  constructor(
    private envService: EnvService,
    private fetchThreatsBattling: FetchThreatsBattlingUseCase,
    private updateHeroToUnassigned: UpdateHeroToUnassignedUseCase,
    private deleteThreatUseCase: DeleteThreatUseCase,
    private createThreatUseCase: CreateThreatUseCase,
  ) {}

  private connect() {
    const socketUrl = this.envService.get('SOCKET_URL')
    this.incomingThreatsSocket = io(socketUrl)

    return this.incomingThreatsSocket
  }

  getSocket = () => {
    if (!this.incomingThreatsSocket) {
      return this.connect()
    }
    return this.incomingThreatsSocket
  }

  async onModuleInit() {
    const threats = await this.fetchThreatsBattling.execute()
    if (threats.isLeft()) return // no left side, just for typescript

    const heroes = threats.value.threats.map(
      (threat) => threat.heroId as UniqueEntityID, // threat must have heroId when battling
    )

    const heroesPromises = heroes.map((heroId) =>
      this.updateHeroToUnassigned.execute({ heroId: heroId.toString() }),
    )

    const threatsPromises = threats.value.threats.map((threat) =>
      this.deleteThreatUseCase.execute({ threatId: threat.id.toString() }),
    )

    await Promise.all([...threatsPromises, ...heroesPromises])

    threats.value.threats.reduce(
      async (acc, threat) => {
        const accResult = await acc

        const result = await this.createThreatUseCase.execute({
          dangerId: threat.dangerId.toString(),
          monsterId: threat.monsterId.toString(),
          longitude: threat.location.lng,
          latitude: threat.location.lat,
        })

        if (result.isLeft()) {
          console.error(result.value)
          return acc
        }

        return [...accResult, result.value]
      },
      Promise.resolve([] as { threat: Threat }[]),
    )
  }

  onModuleDestroy() {
    this.incomingThreatsSocket?.disconnect()
  }
}
