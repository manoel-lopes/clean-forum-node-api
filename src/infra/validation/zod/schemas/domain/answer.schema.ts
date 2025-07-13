import z from 'zod'
import type { Answer } from '@/domain/entities/answer/answer.entity'

export const answerSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  authorId: z.string().uuid(),
  questionId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  excerpt: z.string()
}) satisfies z.ZodType<Answer>
