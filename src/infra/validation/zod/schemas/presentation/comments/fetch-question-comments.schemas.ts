import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { paginationParamsSchema } from '../../core/pagination-params.schema'
import { questionCommentSchema } from '../../domain/question-comment.schema'

export const fetchQuestionCommentsParamsSchema = z.object({
  questionId: z.uuid(),
})

export const fetchQuestionCommentsQuerySchema = paginationParamsSchema

const paginatedQuestionCommentsSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(questionCommentSchema),
  order: z.enum(['asc', 'desc']),
})

export const fetchQuestionCommentsResponsesSchema = {
  200: paginatedQuestionCommentsSchema,
  400: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
