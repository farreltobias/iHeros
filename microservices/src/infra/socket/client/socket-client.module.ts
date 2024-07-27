import { Module } from '@nestjs/common'

import { CreateThreatUseCase } from '@/domain/allocation/application/use-cases/create-threat'
import { DeleteThreatUseCase } from '@/domain/allocation/application/use-cases/delete-threat'
import { FetchThreatsBattlingUseCase } from '@/domain/allocation/application/use-cases/fetch-threats-battling'
import { GetDangerByNameUseCase } from '@/domain/allocation/application/use-cases/get-danger-by-name'
import { GetOrCreateMonsterUseCase } from '@/domain/allocation/application/use-cases/get-or-create-monster'
import { UpdateHeroToUnassignedUseCase } from '@/domain/allocation/application/use-cases/update-hero-to-unassigned'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'

import { SocketServerModule } from '../server/socket-server.module'
import { OccurrenceController } from './controllers/occurrence.controller'
import { SocketClientProvider } from './socket-client.provider'

@Module({
  imports: [DatabaseModule, EnvModule, SocketServerModule],
  providers: [
    SocketClientProvider,
    CreateThreatUseCase,
    GetOrCreateMonsterUseCase,
    GetDangerByNameUseCase,
    FetchThreatsBattlingUseCase,
    UpdateHeroToUnassignedUseCase,
    DeleteThreatUseCase,
  ],
  controllers: [OccurrenceController],
})
export class SocketClientModule {}
