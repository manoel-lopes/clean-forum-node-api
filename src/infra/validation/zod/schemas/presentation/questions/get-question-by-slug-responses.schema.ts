import { z } from 'zod'

export const getQuestionBySlugResponsesSchema = z.object({
  200: z.object({
    question: z.object({
      id: z.string().uuid(),
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      authorId: z.string().uuid(),
      bestAnswerId: z.string().uuid().nullable(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime().nullable()
    })
  }),
  404: z.object({
    message: z.string()
  })
})
