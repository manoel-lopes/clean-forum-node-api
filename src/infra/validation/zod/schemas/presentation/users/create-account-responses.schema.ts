import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'

export const createAccountResponsesSchema = {
  201: z.null(),
  409: errorResponseSchema,
  500: errorResponseSchema,
}
