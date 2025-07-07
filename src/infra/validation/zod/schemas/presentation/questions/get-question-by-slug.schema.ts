import { z } from 'zod'

export const getQuestionBySlugSchema = z.object({
  slug: z.string()
})
