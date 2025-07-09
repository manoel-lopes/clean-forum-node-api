import type { Schema } from 'zod'
import type { FastifySerializerCompiler } from 'fastify/types/schema'

export const serializerCompiler: FastifySerializerCompiler<Schema> = () => {
  return (payload: unknown) => JSON.stringify(payload)
}
