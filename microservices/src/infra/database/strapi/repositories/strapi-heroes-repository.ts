import { Injectable } from '@nestjs/common'

import {
  APIResponseCollectionMetadata,
  APIResponseData,
} from '@/core/types/strapi'
import {
  HeroesRepository,
  LocationParams,
} from '@/domain/allocation/application/repositories/heroes-repository'
import { Hero } from '@/domain/allocation/enterprise/entities/hero'

import { StrapiHeroMapper } from '../mappers/strapi-hero-mapper'
import { StrapiService } from '../strapi.service'

export type HeroData = {
  attributes: Omit<
    APIResponseData<'api::hero.hero'>['attributes'],
    'photo' | 'createdAt' | 'updatedAt' | 'location' | 'rank'
  > & {
    location: {
      address: string
      coordinates: {
        lat: number
        lng: number
      }
      geohash: string
    }
    rank: { data: APIResponseData<'api::rank.rank'> }
  }
} & Omit<APIResponseData<'api::hero.hero'>, 'attributes'>

type HeroCollectionResponse = {
  data: HeroData[]
  meta: APIResponseCollectionMetadata
}

type HeroResponse = {
  data: HeroData | null
}

@Injectable()
export class StrapiHeroesRepository implements HeroesRepository {
  constructor(private strapi: StrapiService) {}

  async findManyNearby(params: LocationParams): Promise<Hero[]> {
    const queryParams = {
      lat: params.location.lat.toString(),
      lng: params.location.lng.toString(),
      threat: params.threatLevel.toString() as string,
      page: params.page.toString(),
    }

    const query = new URLSearchParams(queryParams).toString()

    const heroes = await this.strapi.fetch<HeroCollectionResponse>(
      `heroes/nearby?${query}`,
    )

    if (!heroes || !heroes.data) return []

    return heroes.data.map(StrapiHeroMapper.toDomain)
  }

  async findById(id: string): Promise<Hero | null> {
    const queryParams = { populate: 'rank' }
    const query = new URLSearchParams(queryParams).toString()

    const hero = await this.strapi.fetch<HeroResponse>(`heroes/${id}?${query}`)

    if (!hero || !hero.data) return null

    return StrapiHeroMapper.toDomain(hero.data)
  }

  async save(hero: Hero): Promise<void> {
    const data = StrapiHeroMapper.toStrapi(hero)

    await this.strapi.fetch(`heroes/${hero.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}
