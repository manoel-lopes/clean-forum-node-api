import { errorResponseSchema } from '../core/error-response.schema'
import { z } from 'zod'

export const answerQuestionResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  authorId: z.string().uuid(),
  questionId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  excerpt: z.string()
})

export const answerQuestionResponsesSchema = {
  201: answerQuestionResponseSchema,
  400: errorResponseSchema,
  404: errorResponseSchema
}
