import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { ThreatBattlingEvent } from '../events/threat-battling-event'
import { ThreatCreatedEvent } from '../events/threat-created-event'
import { ThreatResolvedEvent } from '../events/threat-resolved-event'
import { Location } from './value-objects/location'
import { ThreatStatus, ThreatStatusEnum } from './value-objects/threat-status'

export interface ThreatProps {
  status: ThreatStatus
  location: Location
  dangerId: UniqueEntityID
  monsterId: UniqueEntityID

  heroId?: UniqueEntityID | null
  durationTime?: number | null

  createdAt: Date
  battleStartedAt?: Date | null
  updatedAt?: Date | null
}

export class Threat extends AggregateRoot<ThreatProps> {
  get monsterId(): UniqueEntityID {
    return this.props.monsterId
  }

  get status(): ThreatStatus {
    return this.props.status
  }

  set status(status: ThreatStatus) {
    const { value } = status
    const isValidStatus = this.props.status.isValid(value)

    if (!isValidStatus) {
      return
    }

    if (value !== ThreatStatusEnum.UNASSIGNED && !this.durationTime) {
      return
    }

    this.props.status = status
    this.touch()

    if (value === ThreatStatusEnum.BATTLING) {
      this.addDomainEvent(new ThreatBattlingEvent(this))
    }

    if (value === ThreatStatusEnum.RESOLVED) {
      this.addDomainEvent(new ThreatResolvedEvent(this))
    }
  }

  get location(): Location {
    return this.props.location
  }

  get dangerId(): UniqueEntityID {
    return this.props.dangerId
  }

  get heroId(): UniqueEntityID | undefined | null {
    return this.props.heroId
  }

  set heroId(heroId: UniqueEntityID | undefined | null) {
    this.props.heroId = heroId
    this.touch()
  }

  get durationTime(): number | undefined | null {
    return this.props.durationTime
  }

  set durationTime(durationTime: number | undefined | null) {
    this.props.durationTime = durationTime
    this.touch()
  }

  get battleStartedAt(): Date | undefined | null {
    return this.props.battleStartedAt
  }

  set battleStartedAt(battleStartedAt: Date | undefined | null) {
    this.props.battleStartedAt = battleStartedAt
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ThreatProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Threat {
    const threat = new Threat({ createdAt: new Date(), ...props }, id)

    const isNewThreat = !id

    if (isNewThreat) {
      threat.addDomainEvent(new ThreatCreatedEvent(threat))
    }

    return threat
  }
}
