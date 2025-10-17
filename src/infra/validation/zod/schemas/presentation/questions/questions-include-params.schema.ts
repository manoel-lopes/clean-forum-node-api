import { z } from 'zod'
import { paginationParamsSchema } from '../../core/pagination-params.schema'

const questionIncludeOptionsSchema = z.enum(['comments', 'attachments', 'author'])
const parseCommaSeparatedArray = (value: string | string[] | undefined) => {
  if (!value) return undefined
  if (Array.isArray(value)) return value
  return value.split(',').map((item) => item.trim())
}

export const paginationWithIncludeParamsSchema = paginationParamsSchema.extend({
  include: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform(parseCommaSeparatedArray)
    .pipe(z.array(questionIncludeOptionsSchema).optional()),
})
