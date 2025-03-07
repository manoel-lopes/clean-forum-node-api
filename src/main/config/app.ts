import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy/fasitfy.adapter'
import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import { env } from '@/lib/env'
import { usersRoutes } from '../routes/users/users.routes'
import { questionsRoutes } from '../routes/questions/questions.routes'

const app = new FastifyAdapter({
  openapi: {
    info: {
      title: 'Clean Forum Node API',
      version: '1.0.0',
    },
  },
  logger: env.NODE_ENV !== 'production',
})
app.register(usersRoutes)
app.register(questionsRoutes)
app.setErrorHandler(FallbackController.handle)
export { app }
