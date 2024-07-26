import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rank } from '@/domain/allocation/enterprise/entities/rank'

import { RankResponse } from '../repositories/strapi-ranks-repository'

export class StrapiRankMapper {
  static toDomain({ attributes: raw, id }: RankResponse['data']): Rank {
    return Rank.create(
      {
        name: raw.name,
        level: raw.level,
      },
      new UniqueEntityID(id.toString()),
    )
  }
}
