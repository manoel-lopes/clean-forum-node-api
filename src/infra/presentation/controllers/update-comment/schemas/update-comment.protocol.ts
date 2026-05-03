import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { answerCommentSchema } from '@/infra/validation/zod/schemas/domain/answer-comment.schema'
import { questionCommentSchema } from '@/infra/validation/zod/schemas/domain/question-comment.schema'

export const updateCommentParamsSchema = z.object({
  commentId: z.uuid(),
})

export const updateCommentBodySchema = z.object({
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

export const updateQuestionCommentResponsesSchema = {
  200: questionCommentSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}

export const updateAnswerCommentParamsSchema = updateCommentParamsSchema

export const updateAnswerCommentBodySchema = updateCommentBodySchema

export const updateQuestionCommentParamsSchema = updateCommentParamsSchema

export const updateQuestionCommentBodySchema = updateCommentBodySchema
