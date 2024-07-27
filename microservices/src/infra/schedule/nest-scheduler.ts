import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import dayjs from 'dayjs'

import {
  ScheduleParams,
  Scheduler,
} from '@/domain/allocation/application/schedule/scheduler'

@Injectable()
export class NestScheduler implements Scheduler {
  private logger = new Logger('Scheduler')

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  schedule({ date, name, handler }: ScheduleParams): void {
    const cronDate = dayjs(date).isBefore(dayjs())
      ? dayjs(date).add(1, 's').toDate()
      : date

    try {
      const job = new CronJob(cronDate, async () => {
        await handler()
      })

      this.schedulerRegistry.addCronJob(name, job)
      job.start()
    } catch (error) {
      this.logger.error(`job ${name} failed to start`, error)
    }

    const time = dayjs(date).format('h:mm:ss A')
    this.logger.warn(`job ${name} added to execute at ${time}`)
  }
}
