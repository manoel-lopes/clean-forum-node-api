import { z } from 'zod'

export const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type AuthenticateUserSchema = z.infer<typeof authenticateUserSchema>
