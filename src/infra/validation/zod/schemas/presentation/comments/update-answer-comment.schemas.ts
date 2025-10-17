import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerCommentSchema } from '../../domain/answer-comment.schema'

export const updateAnswerCommentParamsSchema = z.object({
  commentId: z.uuid(),
})

export const updateAnswerCommentBodySchema = z.object({
  content: z.string().min(1),
})

export const updateAnswerCommentResponsesSchema = {
  200: answerCommentSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
