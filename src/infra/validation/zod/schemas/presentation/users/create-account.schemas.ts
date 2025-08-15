import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const createAccountBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6)
})

export const createAccountResponsesSchema = {
  201: z.null(),
  400: errorResponseSchema,
  422: errorResponseSchema,
  409: errorResponseSchema,
  500: errorResponseSchema,
}
