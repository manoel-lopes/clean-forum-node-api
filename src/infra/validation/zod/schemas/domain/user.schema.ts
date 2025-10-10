import z from 'zod'
import type { User } from '@/domain/enterprise/entities/user.entity'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Omit<User, 'password'>>
