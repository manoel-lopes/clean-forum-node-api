import z from 'zod'

export const answerSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  authorId: z.uuid(),
  questionId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  excerpt: z.string(),
})
