export type ScheduleParams = {
  date: Date
  name: string
  handler: () => Promise<unknown>
}

export abstract class Scheduler {
  abstract schedule(params: ScheduleParams): void
}
