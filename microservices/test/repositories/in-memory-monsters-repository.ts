import { MonstersRepository } from '@/domain/allocation/application/repositories/monsters-repository'
import { Monster } from '@/domain/allocation/enterprise/entities/monster'

export class InMemoryMonstersRepository implements MonstersRepository {
  public items: Monster[] = []

  async findByName(name: string): Promise<Monster | null> {
    const monster = this.items.find((item) => item.name === name)

    if (!monster) {
      return null
    }

    return monster
  }

  async findById(id: string): Promise<Monster | null> {
    const monster = this.items.find((item) => item.id.toString() === id)

    if (!monster) {
      return null
    }

    return monster
  }

  async create(monster: Monster): Promise<void> {
    this.items.push(monster)
  }
}
