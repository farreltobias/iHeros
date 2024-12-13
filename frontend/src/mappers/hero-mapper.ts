import { Hero, Location } from '../types/characters'
import { APIResponseData } from '../types/strapi'

export class HeroMapper {
  static toClient(data: APIResponseData<'api::hero.hero'>): Hero {
    const jsonLocation = data.attributes.location

    if (!jsonLocation) {
      throw new Error('Location is required')
    }

    if (!data.attributes.photo) {
      throw new Error('Photo is required')
    }

    const location = (jsonLocation as unknown as { coordinates: Location })
      .coordinates as Location

    return {
      id: data.id,
      name: data.attributes.name,
      status: data.attributes.status,
      location,
      photoUrl: data.attributes.photo.data.attributes.url,
      rank: {
        name: data.attributes.rank?.data.attributes.name || 'C',
        level: data.attributes.rank?.data.attributes.level || 4,
      },
    }
  }
}
