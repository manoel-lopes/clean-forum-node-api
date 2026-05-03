import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { paginationWithIncludeParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'

export { paginationWithIncludeParamsSchema }

export const paginatedQuestionsSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  order: z.enum(['asc', 'desc']),
  items: z.array(questionSchema),
})

export const fetchQuestionsResponsesSchemas = {
  200: paginatedQuestionsSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
