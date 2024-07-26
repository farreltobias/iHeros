import {
  HeroesRepository,
  LocationParams,
} from '@/domain/allocation/application/repositories/heroes-repository'
import { Hero } from '@/domain/allocation/enterprise/entities/hero'

import { InMemoryRanksRepository } from './in-memory-ranks-repository'

export class InMemoryHeroesRepository implements HeroesRepository {
  public items: Hero[] = []

  constructor(private ranksRepository: InMemoryRanksRepository) {}

  async findManyNearby(params: LocationParams): Promise<Hero[]> {
    const ranks = Array.from({ length: params.rankLevel }, (_, i) => i + 1)

    const location = params.location.toValue()

    return this.items
      .filter(async ({ rankId }) => {
        const rank = await this.ranksRepository.findById(rankId.toValue())
        return rank && ranks.includes(rank.level)
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
  }

  async findById(id: string): Promise<Hero | null> {
    const hero = this.items.find((item) => item.id.toString() === id)

    if (!hero) {
      return null
    }

    return hero
  }

  async save(hero: Hero): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === hero.id.toString(),
    )

    if (index === -1) {
      return
    }

    this.items[index] = hero
  }
}
