import { PaginationParams } from '@/core/repositories/pagination-params'

import { Hero } from '../../enterprise/entities/hero'
import { Location } from '../../enterprise/entities/value-objects/location'

export interface LocationParams extends PaginationParams {
  location: Location
  threatLevel: number
}

export abstract class HeroesRepository {
  abstract findManyNearby(params: LocationParams): Promise<Hero[]>
  abstract findById(id: string): Promise<Hero | null>
  abstract save(hero: Hero): Promise<void>
}
