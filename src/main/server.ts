import { env } from '@/lib/env'

import { appFactory } from './fastify/app'
import { answersRoutes } from './fastify/routes/answers/answers.routes'
import { questionsRoutes } from './fastify/routes/questions/questions.routes'
import { usersRoutes } from './fastify/routes/users/users.routes'

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
      routes: [usersRoutes, questionsRoutes, answersRoutes]
    })

    await app.listen({ port: env.PORT })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
