import { z } from 'zod'

import type { Answer } from '@/domain/entities/answer/answer.entity'

import { errorResponseSchema } from '../../core/error-response.schema'

export const answerQuestionResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  authorId: z.string().uuid(),
  questionId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  excerpt: z.string()
}) satisfies z.ZodType<Answer>

export const answerQuestionResponsesSchema = {
  201: answerQuestionResponseSchema,
  400: errorResponseSchema,
  404: errorResponseSchema
}
