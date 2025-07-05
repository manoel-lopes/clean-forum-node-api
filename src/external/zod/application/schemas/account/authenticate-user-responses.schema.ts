import { z } from 'zod'

import { errorResponseSchema } from '../core/error-response.schema'

export const authenticateUserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date()
})

export const authenticateUserResponsesSchema = {
  200: authenticateUserResponseSchema,
  400: errorResponseSchema,
  401: errorResponseSchema
}
