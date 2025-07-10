import z from 'zod'

import type { User } from '@/domain/entities/user/user.entity'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
}) satisfies z.ZodType<Omit<User, 'password'>>
