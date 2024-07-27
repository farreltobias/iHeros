import { DomainEvents } from '@/core/events/domain-events'
import { ThreatsRepository } from '@/domain/allocation/application/repositories/threats-repository'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'
import { ThreatStatusEnum } from '@/domain/allocation/enterprise/entities/value-objects/threat-status'

import { InMemoryDangersRepository } from './in-memory-dangers-repository'

export class InMemoryThreatsRepository implements ThreatsRepository {
  public items: Threat[] = []

  constructor(private dangersRepository: InMemoryDangersRepository) {}

  async create(threat: Threat): Promise<void> {
    this.items.push(threat)

    DomainEvents.dispatchEventsForAggregate(threat.id)
  }

  async findById(id: string): Promise<Threat | null> {
    const threat = this.items.find((item) => item.id.toString() === id)

    if (!threat) {
      return null
    }

    return threat
  }

  async findByHeroId(heroId: string): Promise<Threat | null> {
    const threat = this.items.find(
      (item) =>
        item.heroId?.toString() === heroId &&
        item.status.isEqual(ThreatStatusEnum.BATTLING),
    )

    if (!threat) {
      return null
    }

    return threat
  }

  async save(threat: Threat): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === threat.id.toString(),
    )

    if (index === -1) {
      return
    }

    this.items[index] = threat

    if (threat.status.isEqual(ThreatStatusEnum.BATTLING)) {
      return DomainEvents.dispatchEventsForAggregate(threat.id)
    }

    if (threat.status.isEqual(ThreatStatusEnum.RESOLVED)) {
      return DomainEvents.dispatchEventsForAggregate(threat.id)
    }
  }

  async delete(threat: Threat): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === threat.id.toString(),
    )

    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async fetchThreatsBattling(): Promise<Threat[]> {
    const threats = this.items.filter((item) =>
      item.status.isEqual(ThreatStatusEnum.BATTLING),
    )

    return threats
  }

  async findNearby(
    baseLocation: Location,
    rankLevel: number,
  ): Promise<Threat | null> {
    const dangers = Array.from({ length: 4 - (rankLevel - 1) }, (_, i) => 4 - i)
    const location = baseLocation.toValue()

    const threats = await this.items.reduce(
      async (acc, threat) => {
        const { dangerId, status } = threat
        const danger = await this.dangersRepository.findById(dangerId.toValue())

        if (!danger || !dangers.includes(danger.level)) return acc
        if (!status.isEqual(ThreatStatusEnum.UNASSIGNED)) return acc

        const threats = await acc
        return [...threats, threat]
      },
      Promise.resolve([] as Threat[]),
    )

    const [threat] = threats.sort((a, b) => {
      const diffA =
        Number(a.location.lat) -
        location.lat +
        (Number(a.location.lng) - location.lng)

      const diffB =
        Number(b.location.lat) -
        location.lat +
        (Number(b.location.lng) - location.lng)

      if (diffA > diffB) {
        return 1
      } else if (diffA < diffB) {
        return -1
      } else {
        return 0
      }
    })

    if (!threat) return null

    return threat
  }
}
