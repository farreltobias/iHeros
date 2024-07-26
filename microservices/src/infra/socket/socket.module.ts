import { Module } from '@nestjs/common'

import { CreateThreatUseCase } from '@/domain/allocation/application/use-cases/create-threat'
import { GetDangerByNameUseCase } from '@/domain/allocation/application/use-cases/get-danger-by-name'
import { GetOrCreateMonsterUseCase } from '@/domain/allocation/application/use-cases/get-or-create-monster'
import { SelectNearestHeroByThreatUseCase } from '@/domain/allocation/application/use-cases/select-nearest-hero-by-threat'

import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { EventsController } from './controllers/event.controller'
import { SocketIoClientProvider } from './socket.provider'

@Module({
  imports: [DatabaseModule, EnvModule],
  providers: [
    SocketIoClientProvider,
    CreateThreatUseCase,
    GetOrCreateMonsterUseCase,
    GetDangerByNameUseCase,
    SelectNearestHeroByThreatUseCase,
  ],
  controllers: [EventsController],
})
export class SocketModule {}
