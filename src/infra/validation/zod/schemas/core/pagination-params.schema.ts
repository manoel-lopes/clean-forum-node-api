import { z } from 'zod'
import { numericString } from '../util/numeric-string'

const basePaginationParamsSchema = z.strictObject({
  page: numericString
    .optional()
    .default(1)
    .transform((value) => Number(value)),
  pageSize: numericString
    .optional()
    .default(10)
    .transform((value) => Number(value)),
  perPage: numericString
    .optional()
    .transform((value) => Number(value)),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})

export const paginationParamsSchema = basePaginationParamsSchema.transform((data) => ({
  ...data,
  pageSize: data.perPage || data.pageSize
}))

// For extending with other schemas
export const extendablePaginationParamsSchema = basePaginationParamsSchema
