import { z } from 'zod'
import { paginationParamsSchema } from '@/external/zod/core/pagination-params.schema'

export const listQuestionsRequestSchema = z.object({
  query: paginationParamsSchema,
})
