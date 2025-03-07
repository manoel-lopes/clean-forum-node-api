import { z, ZodType } from 'zod'
import type { User } from '@/domain/entities/user/user.entity'

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
}) satisfies ZodType<Omit<User, 'password'>>
