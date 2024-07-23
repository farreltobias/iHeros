import {
  HeroesRepository,
  LocationParams,
} from '@/domain/allocation/application/repositories/heroes-repository'
import { Hero } from '@/domain/allocation/enterprise/entities/hero'

export class InMemoryHeroesRepository implements HeroesRepository {
  public items: Hero[] = []

  async findManyNearby(params: LocationParams): Promise<Hero[]> {
    const location = params.location.toValue()

    return this.items.sort((a, b) => {
      const aLoc = a.baseLocation.toValue()
      const bLoc = b.baseLocation.toValue()

      const diffA =
        Number(aLoc.lat) - location.lat + (Number(aLoc.lng) - location.lng)
      const diffB =
        Number(bLoc.lat) - location.lat + (Number(bLoc.lng) - location.lng)

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
