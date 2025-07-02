import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import { env } from '@/lib/env'
import { accountRoutes } from '../routes/account.routes'
import { questionRoutes } from '../routes/question.routes'

const app = new FastifyAdapter({
  logger: env.NODE_ENV !== 'production',
  openapi: {
    info: {
      title: 'Clean Forum Node API',
      version: '1.0.0',
    },
  }
})
app.setErrorHandler(FallbackController.handle)
app.setValidationCompiler(ZodSchemaParser.parse)
app.register(accountRoutes)
app.register(questionRoutes)

export { app }
