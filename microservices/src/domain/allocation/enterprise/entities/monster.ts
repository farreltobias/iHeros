import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface MonsterProps {
  name: string
  description: string
  photoUrl: string
}

export class Monster extends Entity<MonsterProps> {
  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get photoUrl(): string {
    return this.props.photoUrl
  }

  static create(props: MonsterProps, id?: UniqueEntityID): Monster {
    return new Monster(props, id)
  }
}
