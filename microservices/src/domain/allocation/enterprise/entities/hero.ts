import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Location } from './value-objects/location'

export interface HeroProps {
  name: string
  baseLocation: Location
  rankId: UniqueEntityID
  threatBattlingId?: UniqueEntityID | null

  updatedAt?: Date | null
}

export class Hero extends Entity<HeroProps> {
  get name(): string {
    return this.props.name
  }

  get baseLocation(): Location {
    return this.props.baseLocation
  }

  get threatBattlingId(): UniqueEntityID | undefined | null {
    return this.props.threatBattlingId
  }

  set threatBattlingId(threatBattlingId: UniqueEntityID | undefined | null) {
    this.props.threatBattlingId = threatBattlingId
    this.touch()
  }

  get rankId(): UniqueEntityID {
    return this.props.rankId
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: HeroProps, id?: UniqueEntityID): Hero {
    return new Hero(props, id)
  }
}
