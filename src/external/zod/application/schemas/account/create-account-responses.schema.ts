import { z } from 'zod'

export const createAccountResponsesSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }),
})

export type CreateAccountResponsesSchema = z.infer<typeof createAccountResponsesSchema>
