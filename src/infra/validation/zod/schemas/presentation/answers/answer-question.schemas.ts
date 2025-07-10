import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'
import { answerSchema } from '../../domain/answer.schema'

export const answerQuestionBodySchema = z.object({
  content: z.string().min(1),
  authorId: z.string().uuid()
})

export const answerQuestionParamsSchema = z.object({
  questionId: z.string().uuid()
})

export const answerQuestionResponsesSchema = {
  201: answerSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
