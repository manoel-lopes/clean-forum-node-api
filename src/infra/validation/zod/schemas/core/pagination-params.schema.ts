import { z } from 'zod'
import { numericString } from '../util/numeric-string'

const basePaginationParamsSchema = z.strictObject({
  page: numericString
    .optional()
    .default(1)
    .transform((value) => Number(value))
    .refine((val) => val >= 1, 'Page must be at least 1'),
  pageSize: numericString
    .optional()
    .default(10)
    .refine((val) => val >= 1 && val <= 100, 'Page size must be between 1 and 100'),
  perPage: numericString
    .optional()
    .refine((val) => val === undefined || (val >= 1 && val <= 100), 'Page size must be between 1 and 100'),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})

export const paginationParamsSchema = basePaginationParamsSchema.transform((data) => ({
  ...data,
  pageSize: data.perPage || data.pageSize
}))

// For extending with other schemas
export const extendablePaginationParamsSchema = basePaginationParamsSchema
