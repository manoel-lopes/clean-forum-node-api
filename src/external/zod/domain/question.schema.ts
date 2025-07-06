import { z } from 'zod'

export const questionSchema = z.object({
  id: z.string().uuid().optional(),
  authorId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  bestAnswerId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})
