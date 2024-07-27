import { APIResponseData } from '../../../../../types/strapi'
import { HeroWithRank } from '../../database/repository'

type Location = {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  geohash: string
}

export type HeroResponse = {
  attributes: Omit<
    APIResponseData<'api::hero.hero'>['attributes'],
    'photo' | 'createdAt' | 'updatedAt' | 'location'
  > & {
    location: Location
  }
} & Omit<APIResponseData<'api::hero.hero'>, 'attributes'>

export class HeroDetailsPresenter {
  static toDomain(hero: HeroWithRank): HeroResponse {
    return {
      id: hero.id,
      attributes: {
        name: hero.name,
        location: hero.location,
        status: hero.status,
        rank: {
          data: {
            attributes: {
              level: hero.rank.level,
              name: hero.rank.name,
            },
            id: hero.rank.id,
          },
        },
      },
    }
  }
}
