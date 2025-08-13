import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const deleteQuestionParamsSchema = z.object({
  questionId: z.string().uuid()
})

export const deleteQuestionResponsesSchema = {
  204: z.null(),
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
