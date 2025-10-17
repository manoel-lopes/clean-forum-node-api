import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { paginatedQuestionsSchema } from '../questions/fetch-questions.schemas'

export const fetchUserQuestionsParamsSchema = z.object({
  userId: z.string().min(1)
})

export const fetchUserQuestionsQuerySchema = paginationParamsSchema

export const fetchUserQuestionsResponsesSchema = {
  200: paginatedQuestionsSchema,
  400: errorResponseSchema,
  401: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema
}
