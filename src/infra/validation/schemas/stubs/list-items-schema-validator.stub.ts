import type { PaginationParams } from '@/core/application/pagination-params'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'

export class ListItemsSchemaValidatorStub implements SchemaValidator {
  validate (): PaginationParams {
    return {
      page: 1,
      pageSize: 10,
    }
  }
}
