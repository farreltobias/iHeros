import { FakeLogger } from 'test/log/fake-logger'

import {
  ScheduleParams,
  Scheduler,
} from '@/domain/allocation/application/schedule/scheduler'

export class FakeScheduler implements Scheduler {
  private context = FakeScheduler.name

  constructor(private logger: FakeLogger) {}

  schedule({ date, name, handler }: ScheduleParams): void {
    this.logger.log(`Scheduled ${name} at ${date}`, this.context)

    handler()
  }
}
