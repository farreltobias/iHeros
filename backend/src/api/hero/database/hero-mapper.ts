type HeroWithRank = {
  id: number
  location: string
  name: string
  status: 'UNASSIGNED' | 'BATTLING'
  rankId: number
  rankLevel: number
  rankName: string
}

export class HeroMapper {
  static toDomain(hero: HeroWithRank) {
    return {
      id: hero.id,
      name: hero.name,
      status: hero.status,
      location: JSON.parse(hero.location),
      rank: {
        id: hero.rankId,
        level: hero.rankLevel,
        name: hero.rankName,
      },
    }
  }
}
