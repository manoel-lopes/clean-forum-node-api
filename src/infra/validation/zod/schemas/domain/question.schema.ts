import { z } from 'zod'

export const questionSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.uuid(),
  bestAnswerId: z.uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})
