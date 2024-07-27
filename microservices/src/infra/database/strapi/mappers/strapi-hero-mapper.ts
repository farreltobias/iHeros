import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Hero } from '@/domain/allocation/enterprise/entities/hero'
import {
  HeroStatus,
  HeroStatusEnum,
} from '@/domain/allocation/enterprise/entities/value-objects/hero-status'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'

import { HeroData } from '../repositories/strapi-heroes-repository'

export class StrapiHeroMapper {
  static toDomain({ attributes: raw, id }: HeroData): Hero {
    return Hero.create(
      {
        name: raw.name,
        status: HeroStatus.create(HeroStatusEnum[raw.status]),
        location: new Location({
          lat: raw.location.coordinates.lat,
          lng: raw.location.coordinates.lng,
        }),
        rankId: new UniqueEntityID(raw.rank.data.id.toString()),
      },
      new UniqueEntityID(id.toString()),
    )
  }

  // Only to update status, the hero should not change in the microservice
  static toStrapi(hero: Hero) {
    return {
      data: {
        status: hero.status.value.toString(),
      },
    }
  }
}
