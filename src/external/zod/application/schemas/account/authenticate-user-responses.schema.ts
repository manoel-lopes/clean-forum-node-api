import { z } from 'zod'

export const authenticateUserResponsesSchema = z.object({
  accessToken: z.string(),
})

export type AuthenticateUserResponsesSchema = z.infer<typeof authenticateUserResponsesSchema>
