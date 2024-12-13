import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_SOCKET_URL: z.string().url(),
})

export const envClient = envSchema.parse({
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
})
