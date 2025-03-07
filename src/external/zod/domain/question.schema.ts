import { z, ZodType } from 'zod'
import type { Question } from '@/domain/entities/question/question.entity'

export const questionSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  bestAnswerId: z.string().uuid().nullable(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies ZodType<Question>
