import { z } from 'zod'
import { paginationWithIncludeParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'

export const fetchQuestionAnswersParamsSchema = z.strictObject({
  questionId: z.string().uuid('Question ID must be a valid UUID'),
})

export const fetchQuestionAnswersQuerySchema = paginationWithIncludeParamsSchema
