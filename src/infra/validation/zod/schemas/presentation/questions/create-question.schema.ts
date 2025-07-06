import { z } from 'zod'

export const createQuestionSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().uuid()
})
