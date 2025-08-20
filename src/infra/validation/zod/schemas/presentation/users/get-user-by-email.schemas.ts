import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { userSchema } from '@/infra/validation/zod/schemas/domain/user.schema'

export const getUserByEmailQuerySchema = z.object({
  email: z.email()
})

export const getUserByEmailResponsesSchema = {
  200: userSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
