import { ZodSchema, z } from 'zod'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import type { SchemaValidator, SchemaParseResult } from '../../ports/schema.validator'

export abstract class BaseSchemaValidator<Schema extends z.ZodTypeAny> implements SchemaValidator {
  constructor(private readonly schema: Schema) {}

  validate(data: unknown): SchemaParseResult {
    const parsedData = ZodSchemaParser.parse(this.schema, data)
    return Object.assign({}, ...Object.values(parsedData))
  }
}
