import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'

export const deleteAccountBodySchema = z
  .object({
    userId: z.string().uuid().optional(),
  })
  .optional()

export const deleteAccountResponsesSchema = {
  204: z.null(),
  400: errorResponseSchema,
  403: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
