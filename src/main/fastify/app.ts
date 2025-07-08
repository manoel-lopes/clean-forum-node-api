import {
  fastify,
  type FastifyBaseLogger,
  type FastifyInstance,
  type FastifySchemaCompiler,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from 'fastify'
import { jsonSchemaTransform, serializerCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import type { Schema } from 'zod'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'

import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { ZodSchemaParser } from '@/infra/validation/zod/helpers/zod-schema-parser'

import { env } from '@/lib/env'

import { questionsRoutes } from './routes/questions/questions.routes'
import { usersRoutes } from './routes/users/users.routes'

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>
export async function appFactory () {
  const app = fastify({
    logger: env.NODE_ENV === 'development'
  }).withTypeProvider<ZodTypeProvider>()

  app.setSerializerCompiler(serializerCompiler)
  const validationCompiler: FastifySchemaCompiler<Schema> = ({ schema }) => {
    return (data: unknown) => ZodSchemaParser.parse(schema, data)
  }

  app.setValidatorCompiler(validationCompiler)
  app.setErrorHandler(FallbackController.handle)

  app.register(fastifyCors)
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Clean Forum',
        version: '1.0.0',
        description: 'A forum application API for developers to share knowledge and help each other.'
      }
    },
    transform: jsonSchemaTransform
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  })

  app.register(usersRoutes)
  app.register(questionsRoutes)

  return app
}
