import { z, ZodType } from 'zod'
import type { PaginatedItems } from '@/core/application/paginated-items'
import type { Optional } from '@/util/types/optional'

type PaginatedItemsResponse = Optional<PaginatedItems, 'page' | 'totalPages'>

export function createPaginatedResponseSchema<ItemType extends z.ZodTypeAny> (itemSchema: ItemType) {
  return z.object({
    page: z.number().default(1),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number().default(1),
    items: z.array(itemSchema),
  }) satisfies ZodType<PaginatedItemsResponse>
}
