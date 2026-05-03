import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { userSchema } from '@/infra/validation/zod/schemas/domain/user.schema'

const paginatedUsersSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(userSchema),
})

export const fetchUsersResponsesSchemas = {
  200: paginatedUsersSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
