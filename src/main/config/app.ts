import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import { env } from '@/lib/env'

const app = new FastifyAdapter({ logger: env.NODE_ENV !== 'production' })
app.setErrorHandler(FallbackController.handle)
app.setValidationCompiler(ZodSchemaParser.parse)
export { app }
