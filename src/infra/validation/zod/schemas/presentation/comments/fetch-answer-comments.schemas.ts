import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerCommentSchema } from '../../domain/answer-comment.schema'

export const fetchAnswerCommentsParamsSchema = z.object({
  answerId: z.uuid()
})

export const fetchAnswerCommentsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  perPage: z.string().transform(Number).optional(),
})

const paginatedAnswerCommentsSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(answerCommentSchema),
  order: z.enum(['asc', 'desc'])
})

export const fetchAnswerCommentsResponsesSchema = {
  200: paginatedAnswerCommentsSchema,
  400: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
