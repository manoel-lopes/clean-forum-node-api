import { z } from 'zod'

import { errorResponseSchema } from '../core/error-response.schema'

export const createAccountResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date()
})

export const createAccountResponsesSchema = {
  201: createAccountResponseSchema,
  400: errorResponseSchema,
  409: errorResponseSchema
}
