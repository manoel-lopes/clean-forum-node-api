import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const refreshTokenSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  expiresAt: z.date(),
})

export const refreshTokenBodySchema = z.object({
  refreshTokenId: z.uuid(),
})

export const refreshTokenResponseSchema = {
  200: z.object({ accessToken: z.string() }),
  400: errorResponseSchema,
  401: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema,
}
