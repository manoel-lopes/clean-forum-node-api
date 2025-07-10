import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'

export const deleteAccountParamsSchema = z.object({
  userId: z.string().uuid()
})

export const deleteAccountResponsesSchema = {
  204: z.null(),
  400: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
