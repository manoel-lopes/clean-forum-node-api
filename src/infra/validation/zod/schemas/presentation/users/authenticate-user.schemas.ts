import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { userSchema } from '../../domain/user.schema'

export const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const authenticateUserResponsesSchema = {
  200: userSchema,
  400: errorResponseSchema,
  401: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
