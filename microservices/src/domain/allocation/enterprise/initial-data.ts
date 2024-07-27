import { Duration } from './entities/value-objects/duration'

export const dangers = [
  {
    name: 'God',
    level: 1,
    duration: new Duration({ min: 300, max: 600 }),
  },
  {
    name: 'Dragon',
    level: 2,
    duration: new Duration({ min: 120, max: 300 }),
  },
  {
    name: 'Tiger',
    level: 3,
    duration: new Duration({ min: 10, max: 20 }),
  },
  {
    name: 'Wolf',
    level: 4,
    duration: new Duration({ min: 1, max: 2 }),
  },
] as const
