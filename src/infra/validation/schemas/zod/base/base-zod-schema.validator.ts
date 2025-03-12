import { ZodSchema } from 'zod'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import type { SchemaParseResult, SchemaValidator } from '@/infra/validation/ports/schema.validator'

export abstract class BaseZodSchemaValidator implements SchemaValidator {
  constructor (private readonly schema: ZodSchema) {}

  validate (data: unknown): SchemaParseResult {
    const parsedData = ZodSchemaParser.parse(this.schema, data)
    return !this.hasSubObjects(parsedData)
      ? parsedData
      : this.parseSubObjects(parsedData)
  }

  private hasSubObjects (obj: Record<string, unknown>) {
    return Object.values(obj).some(value => typeof value === 'object')
  }

  private parseSubObjects (obj: Record<string, unknown>) {
    return Object.assign({}, ...Object.values(obj))
  }
}
