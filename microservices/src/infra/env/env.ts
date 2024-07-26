import { z } from 'zod'

export const envSchema = z.object({
  STRAPI_URL: z.string().url(),
  STRAPI_TOKEN: z.string(),
  DATABASE_URL: z.string().url(),
  SOCKET_URL: z.string().url(),
  // REDIS_URL: z.string().optional().default('redis://127.0.0.1:6379/0'),
  PORT: z.coerce.number().optional().default(3333),
  KAFKA_BROKERS: z.string().optional().default('localhost:29092'),
})

export type Env = z.infer<typeof envSchema>
