import { z } from 'zod'

import type { User } from '@/domain/entities/user/user.entity'

import { errorResponseSchema } from '../../core/error-response.schema'

export const authenticateUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
}) satisfies z.ZodType<Omit<User, 'password'>>

export const authenticateUserResponsesSchema = {
  200: authenticateUserResponseSchema,
  400: errorResponseSchema,
  401: errorResponseSchema
}
