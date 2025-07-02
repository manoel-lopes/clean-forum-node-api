import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import { env } from '@/lib/env'
import { accountRoutes } from '@main/routes/account.routes'
import { questionRoutes } from '@main/routes/question.routes'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const app = new FastifyAdapter({ logger: env.NODE_ENV !== 'production' })

app.setErrorHandler(FallbackController.handle)
app.setValidationCompiler(ZodSchemaParser.parse)

await app.register(swagger, {
  swagger: {
    info: {
      title: 'Clean Forum API',
      description: 'API documentation for the Clean Forum application',
      version: '1.0.0',
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})

await app.register(swaggerUi, {
  routePrefix: '/docs',
})

await app.register(accountRoutes)
await app.register(questionRoutes)

export { app }
