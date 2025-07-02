import { z } from 'zod'

export const createQuestionResponsesSchema = z.object({
  question: z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    authorId: z.string().uuid(),
    bestAnswerId: z.string().uuid().optional(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  }),
})

export type CreateQuestionResponsesSchema = z.infer<typeof createQuestionResponsesSchema>
