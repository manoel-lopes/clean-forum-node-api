import { z } from 'zod'

export const questionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.string().uuid(),
  bestAnswerId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable()
})
