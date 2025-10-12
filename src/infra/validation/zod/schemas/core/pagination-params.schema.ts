import { z } from 'zod'
import { numericString } from '../util/numeric-string'

const basePaginationParamsSchema = z.strictObject({
  page: numericString
    .optional()
    .transform((value) => value !== undefined ? Number(value) : 1)
    .refine((val) => val >= 1, 'Page must be at least 1'),
  pageSize: numericString
    .optional()
    .transform((value) => value !== undefined ? Number(value) : 10)
    .refine((val) => val >= 1 && val <= 100, 'Page size must be between 1 and 100'),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})

export const paginationParamsSchema = basePaginationParamsSchema

export const extendablePaginationParamsSchema = basePaginationParamsSchema
