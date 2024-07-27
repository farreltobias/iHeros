import { Module } from '@nestjs/common'

import { OnThreatCreated } from '@/domain/allocation/application/subscribers/on-threat-created'
import { OnThreatResolved } from '@/domain/allocation/application/subscribers/on-threat-resolved'
import { AllocateHeroToThreatUseCase } from '@/domain/allocation/application/use-cases/allocate-hero-to-threat'
import { EndBattleUseCase } from '@/domain/allocation/application/use-cases/end-battle'
import { GetHeroNearbyUseCase } from '@/domain/allocation/application/use-cases/get-hero-nearby'
import { GetThreatNearbyUseCase } from '@/domain/allocation/application/use-cases/get-threat-nearby'

import { DatabaseModule } from '../database/database.module'
import { LogModule } from '../log/logger.module'
import { ScheduleModule } from '../schedule/schedule.module'

@Module({
  imports: [DatabaseModule, ScheduleModule, LogModule],
  providers: [
    OnThreatCreated,
    OnThreatResolved,
    GetHeroNearbyUseCase,
    GetThreatNearbyUseCase,
    AllocateHeroToThreatUseCase,
    EndBattleUseCase,
  ],
})
export class EventsModule {}
