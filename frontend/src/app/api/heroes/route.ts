import { envServer } from '@/src/env/server'
import { APIResponseCollection } from '@/src/types/strapi'

export async function GET() {
  const query = {
    populate: '*',
  }

  const queryString = new URLSearchParams(query).toString()

  const res = await fetch(`${envServer.STRAPI_URL}/api/heroes?${queryString}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${envServer.STRAPI_TOKEN}`,
    },
  })
  const data: APIResponseCollection<'api::hero.hero'> = await res.json()

  return Response.json(data)
}
