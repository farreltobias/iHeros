import {
  ScheduleParams,
  Scheduler,
} from '@/domain/allocation/application/schedule/scheduler'

export class FakeScheduler implements Scheduler {
  schedule({ date, name, handler }: ScheduleParams): void {
    console.log(`Scheduled ${name} at ${date}`)

    handler()
  }
}
