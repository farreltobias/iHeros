import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { WsException } from '@nestjs/websockets'
import { z } from 'zod'

import { CreateThreatUseCase } from '@/domain/allocation/application/use-cases/create-threat'
import { GetDangerByNameUseCase } from '@/domain/allocation/application/use-cases/get-danger-by-name'
import { GetOrCreateMonsterUseCase } from '@/domain/allocation/application/use-cases/get-or-create-monster'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'

const messageDataSchema = z.object({
  location: z.array(
    z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  ),
  dangerLevel: z.string(),
  monsterName: z.string(),
  monster: z.object({
    name: z.string(),
    url: z.string().url(),
    description: z.string(),
  }),
})

const messageDataPipe = new ZodValidationPipe(messageDataSchema)

type MessageDataSchema = z.infer<typeof messageDataSchema>

@Controller()
export class OccurrenceController {
  private logger = new Logger(OccurrenceController.name)

  constructor(
    private getOrCreateMonster: GetOrCreateMonsterUseCase,
    private createThreat: CreateThreatUseCase,
    private getDangerByName: GetDangerByNameUseCase,
  ) {}

  @MessagePattern('occurrence')
  async occurrence(@Payload(messageDataPipe) data: MessageDataSchema) {
    const [monsterResult, dangerResult] = await Promise.all([
      this.getOrCreateMonster.execute({
        name: data.monster.name,
        description: data.monster.description,
        photoUrl: data.monster.url,
      }),
      this.getDangerByName.execute({
        dangerName: data.dangerLevel,
      }),
    ])

    if (dangerResult.isLeft()) {
      throw new WsException('Danger not found')
    }

    if (monsterResult.isLeft()) {
      throw new WsException('Error creating monster')
    }

    const { monster } = monsterResult.value
    const { danger } = dangerResult.value

    const threatResult = await this.createThreat.execute({
      dangerId: danger.id.toString(),
      monsterId: monster.id.toString(),
      latitude: data.location[0].lat,
      longitude: data.location[0].lng,
    })

    if (threatResult.isLeft()) {
      throw new WsException('Error creating threat')
    }

    this.logger.log(`Threat level ${danger.name} incoming!`)
  }
}
