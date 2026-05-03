import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'

export const deleteAnswerParamsSchema = z.object({
  answerId: z.uuid(),
})

export const deleteAnswerResponsesSchema = {
  204: z.null(),
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
