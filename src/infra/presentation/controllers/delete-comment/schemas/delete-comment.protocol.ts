import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'

export const deleteCommentParamsSchema = z.object({
  commentId: z.uuid(),
})

export const deleteCommentResponsesSchema = {
  204: z.null(),
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}

export const deleteAnswerCommentParamsSchema = deleteCommentParamsSchema

export const deleteAnswerCommentResponsesSchema = deleteCommentResponsesSchema

export const deleteQuestionCommentParamsSchema = deleteCommentParamsSchema

export const deleteQuestionCommentResponsesSchema = deleteCommentResponsesSchema
