import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Rank } from './rank'
import { Duration } from './value-objects/duration'

export interface DangerProps {
  name: string
  level: number

  duration: Duration
}

export class Danger extends Entity<DangerProps> {
  get name(): string {
    return this.props.name
  }

  get level(): number {
    return this.props.level
  }

  get duration(): Duration {
    return this.props.duration
  }

  isSuitableForRank(rank: Rank): boolean {
    return this.level >= rank.level
  }

  static create(props: DangerProps, id?: UniqueEntityID): Danger {
    return new Danger(props, id)
  }
}
