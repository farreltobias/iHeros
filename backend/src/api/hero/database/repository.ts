import type { Strapi } from '@strapi/strapi'
import { Tables } from 'knex/types/tables'

import { HeroMapper } from './hero-mapper'

type PaginationParams = {
  offset: number
  limit: number
}

type FindManyNearbyParams = {
  lat: number
  lng: number
  ranks: number[]
} & PaginationParams

type CountByRanksParams = {
  ranks: number[]
}

export type HeroWithRank = Tables['heroes'] & {
  rank: Tables['rank']
}

export class HeroesRepository {
  constructor(private readonly strapi: Strapi) {}

  async countByRanks({ ranks }: CountByRanksParams): Promise<number> {
    const [{ count }] = await this.strapi.db
      .connection('heroes AS h')
      .join('heroes_rank_links AS hr', 'h.id', '=', 'hr.hero_id')
      .join('ranks AS r', 'hr.rank_id', '=', 'r.id')
      .count('h.id')
      .whereNotNull('h.published_at')
      .where('r.level', 'IN', ranks)

    return Number(count)
  }

  async findManyNearby({
    lat,
    lng,
    ranks,
    limit,
    offset,
  }: FindManyNearbyParams): Promise<HeroWithRank[]> {
    const heros = await this.strapi.db
      .connection('heroes AS h')
      .join('heroes_rank_links AS hr', 'h.id', '=', 'hr.hero_id')
      .join('ranks AS r', 'hr.rank_id', '=', 'r.id')
      .select(
        'h.id',
        'h.name',
        'h.status',
        'h.location',
        'r.id AS rankId',
        'r.name AS rankName',
        'r.level AS rankLevel',
      )
      .whereNotNull('h.published_at')
      .where('h.status', '=', 'UNASSIGNED')
      .where('r.level', 'IN', ranks)
      .orderBy('r.level', 'desc')
      .orderByRaw(
        `ST_MakePoint(
          (h.location->'coordinates'->>'lat')::float,
          (h.location->'coordinates'->>'lng')::float
        )::geography <-> ST_MakePoint(?, ?)::geography`,
        [lat, lng],
      )
      .limit(limit)
      .offset(offset)

    return heros.map(HeroMapper.toDomain)
  }
}
