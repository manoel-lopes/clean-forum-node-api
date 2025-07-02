import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import { env } from '@/lib/env'
import { z } from 'zod'

const app = new FastifyAdapter({ logger: env.NODE_ENV !== 'production' })
app.setErrorHandler(FallbackController.handle)
app.setValidationCompiler(ZodSchemaParser.parse)
app.get('/', {
  schema: {
    response: {
      200: z.object({
        message: z.string()
      })
    }
  }
}, async () => {
  return { message: 'Hello World!' }
})

export { app }
