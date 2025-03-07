import type { PaginationParams } from '@/core/application/pagination-params'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'

export type ListItemsData = {
  params?: Record<string, string>
  query: PaginationParams
}

export type ListItemsSchemaValidator = SchemaValidator<ListItemsData, PaginationParams>
