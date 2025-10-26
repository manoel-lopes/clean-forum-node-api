import { fastify } from 'fastify'
import { jsonSchemaTransform, type ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { errorHandlerFactory } from './middlewares/error-handler'
import { bullBoardPlugin } from './plugins/bull-board'
import { mailerPlugin } from './plugins/mailer'
import { rateLimitPlugin } from './plugins/rate-limit'
import { serializerCompiler } from './plugins/serializer'
import { validatorCompiler } from './plugins/validator'

type APPConfig = {
  logger?: boolean
  swagger?: {
    info: {
      title: string
      description: string
      version: string
    }
  }
}

export async function appFactory (config?: APPConfig) {
  const app = fastify({
    logger: config?.logger && {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    keepAliveTimeout: 72000,
    connectionTimeout: 0,
    requestIdLogLabel: 'reqId',
  }).withTypeProvider<ZodTypeProvider>()
  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)
  app.setErrorHandler(errorHandlerFactory)
  app.register(rateLimitPlugin())
  app.register(mailerPlugin)
  app.register(bullBoardPlugin)
  app.register(fastifyCors)
  app.register(fastifySwagger, {
    openapi: config?.swagger,
    transform: jsonSchemaTransform,
  })
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })
  return app
}
