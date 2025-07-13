import { z } from 'zod'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'
import { errorResponseSchema } from '../../core/error-response.schema'

const paginatedQuestionsSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(questionSchema)
})
export const fetchQuestionsResponsesSchemas = {
  200: paginatedQuestionsSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
