import { fastify, type FastifyInstance } from 'fastify'
import { jsonSchemaTransform, type ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
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
  routes?: Array<(app: FastifyInstance) => Promise<void>>
}
export async function appFactory (config?: APPConfig) {
  const app = fastify({
    logger: config?.logger
  }).withTypeProvider<ZodTypeProvider>()
  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)
  app.setErrorHandler(FallbackController.handle)
  app.register(fastifyCors)
  app.register(fastifySwagger, {
    openapi: config?.swagger,
    transform: jsonSchemaTransform
  })
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  })
  for (const route of config?.routes || []) {
    app.register(route)
  }
  return app
}
