import { z } from 'zod'
import type { SchemaParseResult } from '@/infra/validation/ports/schema-parse-result'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { ZodErrorMapper } from '../config/zod-error-mappers'

export abstract class ZodSchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema, data: unknown): T {
    ZodErrorMapper.setErrorMap()
    const parsedSchema = schema.safeParse(data)
    if (!parsedSchema.success) {
      throw new SchemaValidationError(parsedSchema.error.errors[0].message)
    }
    return parsedSchema.data
  }
}
