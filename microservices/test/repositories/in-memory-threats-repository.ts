import { ThreatsRepository } from '@/domain/allocation/application/repositories/threats-repository'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'

import { InMemoryDangersRepository } from './in-memory-dangers-repository'

export class InMemoryThreatsRepository implements ThreatsRepository {
  public items: Threat[] = []

  constructor(private dangersRepository: InMemoryDangersRepository) {}

  async create(threat: Threat): Promise<void> {
    this.items.push(threat)
  }

  async findById(id: string): Promise<Threat | null> {
    const threat = this.items.find((item) => item.id.toString() === id)

    if (!threat) {
      return null
    }

    return threat
  }

  async findByHeroId(heroId: string): Promise<Threat | null> {
    const threat = this.items.find((item) => item.heroId?.toString() === heroId)

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
  }

  async findNearby(
    baseLocation: Location,
    rankLevel: number,
  ): Promise<Threat | null> {
    const dangers = Array.from({ length: rankLevel }, (_, i) => i + 1)

    const location = baseLocation.toValue()

    const [threat] = this.items
      .filter(async ({ dangerId }) => {
        const danger = await this.dangersRepository.findById(dangerId.toValue())
        return danger && dangers.includes(danger.level)
      })
      .sort((a, b) => {
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
