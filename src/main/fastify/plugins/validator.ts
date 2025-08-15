import type { Schema } from 'zod'
import type { FastifySchemaCompiler } from 'fastify'
import { ZodSchemaParser } from '@/infra/validation/zod/helpers/zod-schema-parser'

export const validatorCompiler: FastifySchemaCompiler<Schema> = ({ schema }) => {
  return (data: unknown) => {
    try {
      const value = ZodSchemaParser.parse(schema, data)
      return { value }
    } catch (error) {
      return { error }
    }
  }
}
