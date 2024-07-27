import { Module } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'

import { Scheduler } from '@/domain/allocation/application/schedule/scheduler'

import { NestScheduler } from './nest-scheduler'

@Module({
  providers: [
    SchedulerRegistry,
    {
      provide: Scheduler,
      useClass: NestScheduler,
    },
  ],
  exports: [Scheduler],
})
export class ScheduleModule {}
