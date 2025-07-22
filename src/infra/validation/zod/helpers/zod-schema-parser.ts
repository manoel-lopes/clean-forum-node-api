import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { SchemaParseResult } from '@/infra/validation/ports/schema-parse-result'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { ZodErrorMapper } from '../config/zod-error-mappers'

export abstract class ZodSchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema, data: unknown): T {
    ZodErrorMapper.setErrorMap()
    const parsedSchema = schema.safeParse(data)
    if (!parsedSchema.success) {
      const validationError = fromZodError(parsedSchema.error, {
        prefix: null,
        issueSeparator: '; ',
        includePath: false
      })
      throw new SchemaValidationError(validationError.message.split('; ')[0])
    }
    return parsedSchema.data
  }
}
