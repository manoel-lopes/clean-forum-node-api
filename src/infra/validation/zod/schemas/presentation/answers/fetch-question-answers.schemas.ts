import { z } from 'zod'
import { paginationWithIncludeParamsSchema } from '../../core/pagination-params.schema'

export const fetchQuestionAnswersParamsSchema = z.strictObject({
  questionId: z.string().uuid('Question ID must be a valid UUID'),
})

export const fetchQuestionAnswersQuerySchema = paginationWithIncludeParamsSchema
