import { z } from 'zod'
import { refreshTokenSchema } from '@/infra/presentation/controllers/refresh-token/schemas/refresh-token.protocol'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'

export const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authenticateUserResponsesSchema = {
  200: z.object({
    token: z.string(),
    refreshToken: refreshTokenSchema,
  }),
  400: errorResponseSchema,
  401: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
