import z from 'zod'

import type { Question } from '@/domain/entities/question/question.entity'

export const questionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.string().uuid(),
  bestAnswerId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<Question>
