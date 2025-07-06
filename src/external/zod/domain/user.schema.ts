import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})
