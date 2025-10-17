import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { refreshTokenSchema } from './refresh-tokens.schemas'

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
