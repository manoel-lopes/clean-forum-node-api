import { appFactory } from '../../src/main/fastify/app'
import { answersRoutes } from '../../src/main/fastify/routes/answers.routes'
import { commentsRoutes } from '../../src/main/fastify/routes/comments.routes'
import { questionsRoutes } from '../../src/main/fastify/routes/questions.routes'
import { sessionRoutes } from '../../src/main/fastify/routes/session.routes'
import { usersRoutes } from '../../src/main/fastify/routes/users.routes'

export async function createTestApp () {
  const app = await appFactory({
    routes: [
      usersRoutes,
      questionsRoutes,
      sessionRoutes,
      answersRoutes,
      commentsRoutes
    ]
  })

  await app.ready()

  return app
}
