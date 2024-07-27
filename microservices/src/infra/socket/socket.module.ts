import { Module } from '@nestjs/common'

import { CreateThreatUseCase } from '@/domain/allocation/application/use-cases/create-threat'
import { DeleteThreatUseCase } from '@/domain/allocation/application/use-cases/delete-threat'
import { FetchThreatsBattlingUseCase } from '@/domain/allocation/application/use-cases/fetch-threats-battling'
import { GetDangerByNameUseCase } from '@/domain/allocation/application/use-cases/get-danger-by-name'
import { GetOrCreateMonsterUseCase } from '@/domain/allocation/application/use-cases/get-or-create-monster'
import { UpdateHeroToUnassignedUseCase } from '@/domain/allocation/application/use-cases/update-hero-to-unassigned'

import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { OccurrenceController } from './controllers/occurrence.controller'
import { SocketIoClientProvider } from './socket.provider'

@Module({
  imports: [DatabaseModule, EnvModule],
  providers: [
    SocketIoClientProvider,
    CreateThreatUseCase,
    GetOrCreateMonsterUseCase,
    GetDangerByNameUseCase,
    FetchThreatsBattlingUseCase,
    UpdateHeroToUnassignedUseCase,
    DeleteThreatUseCase,
  ],
  controllers: [OccurrenceController],
})
export class SocketModule {}
