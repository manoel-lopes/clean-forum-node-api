import { z } from 'zod'

import type { User } from '@/domain/entities/user/user.entity'

import { errorResponseSchema } from '../../core/error-response.schema'

export const getUserByEmailResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<Omit<User, 'password'>>

export const getUserByEmailResponsesSchema = {
  200: getUserByEmailResponseSchema,
  400: errorResponseSchema,
  404: errorResponseSchema
}
