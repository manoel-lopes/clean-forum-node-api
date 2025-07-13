import { z } from 'zod'
import { answerSchema } from '@/infra/validation/zod/schemas/domain/answer.schema'
import { errorResponseSchema } from '../../core/error-response.schema'

const paginatedAnswersSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(answerSchema)
})
export const fetchQuestionAnswersResponsesSchemas = {
  200: paginatedAnswersSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
