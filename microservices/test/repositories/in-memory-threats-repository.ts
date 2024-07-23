import { ThreatsRepository } from '@/domain/allocation/application/repositories/threats-repository'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'

export class InMemoryThreatsRepository implements ThreatsRepository {
  public items: Threat[] = []

  async findById(id: string): Promise<Threat | null> {
    const threat = this.items.find((item) => item.id.toString() === id)

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
}
