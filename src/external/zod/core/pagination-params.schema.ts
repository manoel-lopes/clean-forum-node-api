import { z } from 'zod'
import { numericStringSchema } from '../util/schemas/numeric-string-schema'

export const paginationParamsSchema = z.strictObject({
  page: numericStringSchema.optional().default('1').transform(value => Number(value)),
  pageSize: numericStringSchema.optional().default('10').transform(value => Number(value)),
})
