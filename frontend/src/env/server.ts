import { z } from 'zod'

export const envSchema = z.object({
  STRAPI_URL: z.string().url(),
  STRAPI_TOKEN: z.string(),
  BASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>

export const envServer = envSchema.parse(process.env)
