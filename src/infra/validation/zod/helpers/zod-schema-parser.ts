import { z } from 'zod'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { ZodErrorMapper } from '../config/zod-error-mappers'

export class ZodSchemaParser {
  static parse<T = unknown>(schema: z.Schema<T>, data: unknown): T {
    try {
      ZodErrorMapper.setErrorMap()
      return schema.parse(data)
    } catch (error) {
      const message = error.issues[0].message
      throw new SchemaValidationError(message)
    }
  }
}
