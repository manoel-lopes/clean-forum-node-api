import { z, ZodType } from 'zod'
import type { User } from '@/infra/persistence/typeorm/data-mappers/user/user.mapper'

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
}) satisfies ZodType<Omit<User, 'password'>>
