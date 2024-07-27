import { Injectable } from '@nestjs/common'

import { APIResponse } from '@/core/types/strapi'
import { RanksRepository } from '@/domain/allocation/application/repositories/ranks-repository'
import { Rank } from '@/domain/allocation/enterprise/entities/rank'

import { StrapiRankMapper } from '../mappers/strapi-rank-mapper'
import { StrapiService } from '../strapi.service'

export type RankResponse = APIResponse<'api::rank.rank'>

@Injectable()
export class StrapiRanksRepository implements RanksRepository {
  constructor(private strapi: StrapiService) {}

  async findById(id: string): Promise<Rank | null> {
    const rank = await this.strapi.fetch<RankResponse>(`ranks/${id}`)

    if (!rank || !rank.data) return null

    return StrapiRankMapper.toDomain(rank.data)
  }
}
