import type { Schema } from 'zod'
import type { FastifySchemaCompiler } from 'fastify'

export const validatorCompiler: FastifySchemaCompiler<Schema> = ({ schema }) => {
  return (data: unknown) => {
    const result = schema.safeParse(data)
    if (result.success) {
      return { value: result.data }
    } else {
      return { error: result.error }
    }
  }
}
