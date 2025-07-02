import { z } from 'zod'
import { numericString } from '../util/numeric-string'

export const paginationParamsSchema = z.strictObject({
  page: numericString.optional().default('1').transform(value => Number(value)),
  pageSize: numericString.optional().default('10').transform(value => Number(value)),
})
