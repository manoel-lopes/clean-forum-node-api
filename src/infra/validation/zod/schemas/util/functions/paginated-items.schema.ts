import { z } from 'zod'

export const paginatedItemsSchema = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  items: z.array(itemSchema),
  order: z.enum(['asc', 'desc']).optional().default('desc')
})
