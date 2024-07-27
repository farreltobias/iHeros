import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import * as dayjs from 'dayjs'

import {
  ScheduleParams,
  Scheduler,
} from '@/domain/allocation/application/schedule/scheduler'

@Injectable()
export class NestScheduler implements Scheduler {
  private logger = new Logger('Scheduler')

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  schedule({ date, name, handler }: ScheduleParams): void {
    const job = new CronJob(date, async () => {
      await handler()
    })

    this.schedulerRegistry.addCronJob(name, job)
    job.start()

    const time = dayjs(date).format('h:mm:ss A')
    this.logger.warn(`job ${name} added to execute at ${time}`)
  }
}
