import { appFactory } from '@/main/fastify/app'
import { answersRoutes } from '@/main/fastify/routes/answers.routes'
import { commentsRoutes } from '@/main/fastify/routes/comments.routes'
import { questionsRoutes } from '@/main/fastify/routes/questions.routes'
import { sessionRoutes } from '@/main/fastify/routes/session.routes'
import { usersRoutes } from '@/main/fastify/routes/users.routes'

type TestAppOptions = {
  rateLimitEnabled?: boolean
}

export async function createTestApp (options: TestAppOptions = {}) {
  let app
  if (options.rateLimitEnabled === true) {
    // Temporarily set NODE_ENV to development to enable proper rate limits for specific tests
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    app = await appFactory()
    process.env.NODE_ENV = originalEnv
  } else {
    app = await appFactory()
  }

  app.register(usersRoutes)
  app.register(sessionRoutes)
  app.register(questionsRoutes)
  app.register(answersRoutes)
  app.register(commentsRoutes)
  return app
}
