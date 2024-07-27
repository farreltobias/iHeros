import type { Strapi } from '@strapi/types'
import type { Context, ExtendableContext } from 'koa'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { APIResponseCollectionMetadata } from '../../../../types/strapi'
import { HeroesRepository } from '../database/repository'
import {
  HeroDetailsPresenter,
  HeroResponse,
} from './presenters/hero-details-presenter'

type Response = {
  data: HeroResponse[]
  meta: APIResponseCollectionMetadata
}

const FindManyNearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  threat: z.coerce.number().min(1).max(4).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
})

export async function findManyNearby(
  ctx: Context,
  strapi: Strapi,
): Promise<Response | ExtendableContext> {
  const heroesRepository = new HeroesRepository(strapi)

  const result = FindManyNearbyQuerySchema.safeParse(ctx.query)

  if (!result.success) {
    return ctx.badRequest(fromZodError(result.error))
  }

  const { lat, lng, threat = 4, page = 1, limit = 20 } = result.data

  const ranks = Array.from({ length: threat }, (_, i) => i + 1)
  const offset = limit * (page - 1)

  const [total, heroes] = await Promise.all([
    heroesRepository.countByRanks({ ranks }),
    heroesRepository.findManyNearby({ lat, lng, ranks, limit, offset }),
  ])

  const pageCount = Math.ceil(total / limit)

  return {
    data: heroes.map(HeroDetailsPresenter.toDomain),
    meta: {
      pagination: {
        page,
        pageCount,
        pageSize: limit,
        total,
      },
    },
  }
}
