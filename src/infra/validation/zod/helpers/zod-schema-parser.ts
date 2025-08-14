import { z } from 'zod'
import type { SchemaParseResult } from '@/infra/validation/ports/schema-parse-result'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { ZodErrorMapper } from '../config/zod-error-mappers'

export abstract class ZodSchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema<T>, data: unknown): T {
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      const message = ZodErrorMapper.format(first)
      throw new SchemaValidationError(message)
    }
    return parsed.data
  }
}
