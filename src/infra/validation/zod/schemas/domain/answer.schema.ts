import z from 'zod'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'

export const answerSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  authorId: z.uuid(),
  questionId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  excerpt: z.string()
}) satisfies z.ZodType<Answer>
