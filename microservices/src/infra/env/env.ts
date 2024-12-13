import { z } from 'zod'

export const envSchema = z.object({
  STRAPI_URL: z.string().url(),
  STRAPI_TOKEN: z.string(),
  DATABASE_URL: z.string().url(),
  SOCKET_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
