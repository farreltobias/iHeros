import { Module } from '@nestjs/common'

import { OnThreatBattling } from '@/domain/allocation/application/subscribers/on-threat-battling'
import { OnThreatCreated } from '@/domain/allocation/application/subscribers/on-threat-created'
import { OnThreatResolved } from '@/domain/allocation/application/subscribers/on-threat-resolved'
import { AllocateHeroToThreatUseCase } from '@/domain/allocation/application/use-cases/allocate-hero-to-threat'
import { EndBattleUseCase } from '@/domain/allocation/application/use-cases/end-battle'
import { GetHeroNearbyUseCase } from '@/domain/allocation/application/use-cases/get-hero-nearby'
import { GetThreatNearbyUseCase } from '@/domain/allocation/application/use-cases/get-threat-nearby'

import { DatabaseModule } from '../database/database.module'
import { LogModule } from '../log/logger.module'
import { ScheduleModule } from '../schedule/schedule.module'
import { SocketServerModule } from '../socket/server/socket-server.module'

@Module({
  imports: [DatabaseModule, ScheduleModule, LogModule, SocketServerModule],
  providers: [
    OnThreatCreated,
    OnThreatResolved,
    OnThreatBattling,
    GetHeroNearbyUseCase,
    GetThreatNearbyUseCase,
    AllocateHeroToThreatUseCase,
    EndBattleUseCase,
  ],
})
export class EventsModule {}
