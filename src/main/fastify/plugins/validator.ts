import type { Schema } from 'zod'
import type { FastifySchemaCompiler } from 'fastify'
import { ZodSchemaParser } from '@/infra/validation/zod/helpers/zod-schema-parser' // Import ZodSchemaParser

export const validatorCompiler: FastifySchemaCompiler<Schema> = ({ schema }) => {
  return (data: unknown) => {
    try {
      const value = ZodSchemaParser.parse(schema, data)
      return { value }
    } catch (error) {
      // ZodSchemaParser will throw SchemaValidationError
      return { error: error as Error } // Fastify expects an Error object here
    }
  }
}
