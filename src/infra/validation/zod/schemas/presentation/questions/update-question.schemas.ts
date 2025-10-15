import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const updateQuestionParamsSchema = z.object({
  questionId: z.string().uuid(),
})

export const updateQuestionBodySchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
})

export const updateQuestionResponsesSchema = {
  200: z.object({
    question: z.object({
      id: z.string().uuid(),
      title: z.string(),
      content: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      authorId: z.string().uuid(),
      bestAnswerId: z.string().uuid().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  }),
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
