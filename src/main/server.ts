import { env } from '@/lib/env'
import { appFactory } from './fastify/app'
import { answersRoutes } from './fastify/routes/answers.routes'
import { commentsRoutes } from './fastify/routes/comments.routes'
import { questionsRoutes } from './fastify/routes/questions.routes'
import { sessionRoutes } from './fastify/routes/session.routes'
import { usersRoutes } from './fastify/routes/users.routes'

async function bootstrap () {
  try {
    const app = await appFactory({
      logger: env.NODE_ENV !== 'production',
      swagger: {
        info: {
          title: 'Clean Forum API',
          description: 'API for the Clean Forum application',
          version: '1.0.0'
        }
      },
      routes: [
        sessionRoutes,
        usersRoutes,
        questionsRoutes,
        answersRoutes,
        commentsRoutes,
      ]
    })
    await app.listen({ port: env.PORT })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
