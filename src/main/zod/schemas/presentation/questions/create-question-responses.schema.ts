import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'

export const createQuestionResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.string().uuid(),
  bestAnswerId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const createQuestionResponsesSchema = {
  201: createQuestionResponseSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  409: errorResponseSchema
}
