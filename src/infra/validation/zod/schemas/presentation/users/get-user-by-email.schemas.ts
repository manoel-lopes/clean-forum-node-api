import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { userSchema } from '../../domain/user.schema'

export const getUserByEmailQuerySchema = z.object({
  email: z.string().email()
})

export const getUserByEmailResponsesSchema = {
  200: userSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
