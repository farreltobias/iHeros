import { DangersRepository } from '@/domain/allocation/application/repositories/dangers-repository'
import { Danger } from '@/domain/allocation/enterprise/entities/danger'

export class InMemoryDangersRepository implements DangersRepository {
  public items: Danger[] = []

  async findById(id: string): Promise<Danger | null> {
    const danger = this.items.find((item) => item.id.toString() === id)

    if (!danger) {
      return null
    }

    return danger
  }
}
