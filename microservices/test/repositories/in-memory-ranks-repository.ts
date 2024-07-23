import { RanksRepository } from '@/domain/allocation/application/repositories/ranks-repository'
import { Rank } from '@/domain/allocation/enterprise/entities/rank'

export class InMemoryRanksRepository implements RanksRepository {
  public items: Rank[] = []

  async findById(id: string): Promise<Rank | null> {
    const rank = this.items.find((item) => item.id.toString() === id)

    if (!rank) {
      return null
    }

    return rank
  }
}
