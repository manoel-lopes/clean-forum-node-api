import { z } from 'zod'

import type { Question } from '@/domain/entities/question/question.entity'

import { errorResponseSchema } from '../../core/error-response.schema'

export const chooseQuestionBestAnswerResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.string().uuid(),
  bestAnswerId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<Question>

export const chooseQuestionBestAnswerResponsesSchema = {
  200: chooseQuestionBestAnswerResponseSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema
}
