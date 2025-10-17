import { z } from 'zod'
import { numericString } from '../util/numeric-string'

const basePaginationParamsSchema = z.strictObject({
  page: numericString
    .optional()
    .transform((value) => (value !== undefined ? Number(value) : 1))
    .refine((val) => val >= 1, 'Page must be at least 1'),
  pageSize: numericString
    .optional()
    .transform((value) => (value !== undefined ? Number(value) : 20))
    .refine((val) => val >= 1 && val <= 50, 'Page size must be between 1 and 50'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const paginationParamsSchema = basePaginationParamsSchema

export const extendablePaginationParamsSchema = basePaginationParamsSchema

const includeOptionsSchema = z.enum(['comments', 'attachments', 'author'])
const parseCommaSeparatedArray = (value: string | string[] | undefined) => {
  if (!value) return undefined
  if (Array.isArray(value)) return value
  return value.split(',').map((item) => item.trim())
}

export const paginationWithIncludeParamsSchema = basePaginationParamsSchema.extend({
  include: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(parseCommaSeparatedArray)
    .pipe(z.array(includeOptionsSchema).optional()),
})

export const paginationWithFieldsParamsSchema = basePaginationParamsSchema.extend({
  fields: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(parseCommaSeparatedArray)
    .pipe(z.array(z.string()).optional()),
})

export const paginationWithIncludeAndFieldsParamsSchema = basePaginationParamsSchema.extend({
  include: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(parseCommaSeparatedArray)
    .pipe(z.array(includeOptionsSchema).optional()),
  fields: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(parseCommaSeparatedArray)
    .pipe(z.array(z.string()).optional()),
})
