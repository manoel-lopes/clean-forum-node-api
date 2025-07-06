import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'

export const createAccountResponsesSchema = {
  201: z.null(),
  400: errorResponseSchema,
  409: errorResponseSchema
}
