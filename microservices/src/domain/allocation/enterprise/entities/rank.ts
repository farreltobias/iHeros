import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Danger } from './danger'

export interface RankProps {
  name: string
  level: number
}

export class Rank extends Entity<RankProps> {
  get name(): string {
    return this.props.name
  }

  get level(): number {
    return this.props.level
  }

  isSuitableForDanger(danger: Danger): boolean {
    return this.level <= danger.level
  }

  static create(props: RankProps, id?: UniqueEntityID): Rank {
    return new Rank(props, id)
  }
}
