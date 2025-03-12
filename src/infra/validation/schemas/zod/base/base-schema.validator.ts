import { ZodSchema } from 'zod'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import type { SchemaParseResult, SchemaValidator } from '@/infra/validation/ports/schema.validator'

export abstract class BaseSchemaValidator implements SchemaValidator {
  constructor (private readonly schema: ZodSchema) {}

  validate (data: unknown): SchemaParseResult {
    const parsedData = ZodSchemaParser.parse(this.schema, data)
    return Object.assign({}, ...Object.values(parsedData))
  }
}
