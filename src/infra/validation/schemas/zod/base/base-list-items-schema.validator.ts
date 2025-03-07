import { ZodSchema } from 'zod'
import type {
  ListItemsSchemaValidator,
  ListItemsData,
} from '@/infra/validation/ports/list-items-schema.validator'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'

export abstract class BaseListItemsSchemaValidator implements ListItemsSchemaValidator {
  constructor (private readonly schema: ZodSchema) {}

  validate (data: unknown) {
    const { params, query } = ZodSchemaParser.parse<ListItemsData>(this.schema, data)
    return { ...params, ...query }
  }
}
