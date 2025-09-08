import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { questionCommentSchema } from '../../domain/question-comment.schema'

export const updateQuestionCommentParamsSchema = z.object({
  commentId: z.uuid()
})

export const updateQuestionCommentBodySchema = z.object({
  content: z.string().min(1),
})

export const updateQuestionCommentResponsesSchema = {
  200: questionCommentSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
