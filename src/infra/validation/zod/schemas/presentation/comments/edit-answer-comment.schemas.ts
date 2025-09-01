import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerCommentSchema } from '../../domain/answer-comment.schema'

export const editAnswerCommentParamsSchema = z.object({
  commentId: z.uuid()
})

export const editAnswerCommentBodySchema = z.object({
  content: z.string().min(1),
})

export const editAnswerCommentResponsesSchema = {
  200: answerCommentSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
