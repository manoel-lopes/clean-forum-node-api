import { z } from 'zod'

export const questionSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  bestAnswerId: z.uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable()
})
