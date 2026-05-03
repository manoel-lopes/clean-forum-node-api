import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { answerSchema } from '@/infra/validation/zod/schemas/domain/answer.schema'

export const answerQuestionBodySchema = z.object({
  questionId: z.uuid(),
  content: z.string().min(1),
})

export const answerQuestionResponsesSchema = {
  201: answerSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
