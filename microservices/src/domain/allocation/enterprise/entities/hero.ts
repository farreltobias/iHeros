import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { HeroStatus } from './value-objects/hero-status'
import { Location } from './value-objects/location'

export interface HeroProps {
  name: string
  location: Location
  rankId: UniqueEntityID

  status: HeroStatus
  updatedAt?: Date | null
}

export class Hero extends Entity<HeroProps> {
  get name(): string {
    return this.props.name
  }

  get location(): Location {
    return this.props.location
  }

  get status(): HeroStatus {
    return this.props.status
  }

  set status(status: HeroStatus) {
    const { value } = status
    const isValidStatus = this.props.status.isValid(value)

    if (!isValidStatus) {
      return
    }

    this.props.status = status
    this.touch()
  }

  get rankId(): UniqueEntityID {
    return this.props.rankId
  }

  get updatedAt(): Date {
    return this.props.updatedAt!
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: HeroProps, id?: UniqueEntityID): Hero {
    return new Hero(props, id)
  }
}
