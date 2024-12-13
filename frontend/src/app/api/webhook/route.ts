// import { revalidateTag } from 'next/cache'

import { WebhookBody } from '@/src/types/strapi'

const events = [
  'entry.publish',
  'entry.unpublish',
  'entry.update',
  'entry.delete',
] as const

export async function POST(request: Request) {
  const body: WebhookBody = await request.json()

  if (body.model !== 'hero' || !events.includes(body.event)) {
    return Response.json({ res: 'ok' })
  }

  // revalidateTag(body.event)
  return Response.json({ res: 'ok' })
}
