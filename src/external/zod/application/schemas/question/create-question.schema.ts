import { z } from 'zod'

export const createQuestionSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
})

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>
