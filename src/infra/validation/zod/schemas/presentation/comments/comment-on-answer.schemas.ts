import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerCommentSchema } from '../../domain/answer-comment.schema'

export const commentOnAnswerBodySchema = z.object({
  answerId: z.uuid(),
  content: z.string().min(1),
})

export const commentOnAnswerResponsesSchema = {
  201: answerCommentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
