import { z } from 'zod'

export const answerSchema = z.object({
  id: z.string().uuid().optional(),
  content: z.string(),
  questionId: z.string().uuid(),
  authorId: z.string().uuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})
