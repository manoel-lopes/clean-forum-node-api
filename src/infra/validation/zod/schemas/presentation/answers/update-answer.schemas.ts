import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerSchema } from '../../domain/answer.schema'

export const updateAnswerParamsSchema = z.object({
  answerId: z.string().uuid(),
})

export const updateAnswerBodySchema = z.object({
  content: z.string().min(1).optional(),
})

export const updateAnswerResponsesSchema = {
  200: z.object({
    answer: answerSchema,
  }),
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
