import { EmailQueueConsumer } from '@/infra/queues/email/email-queue.consumer'
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
          version: '1.0.0',
        },
      },
    })
    const emailQueueConsumer = new EmailQueueConsumer(app)
    app.register(usersRoutes)
    app.register(sessionRoutes)
    app.register(questionsRoutes)
    app.register(answersRoutes)
    app.register(commentsRoutes)
    app.addHook('onClose', async () => {
      await emailQueueConsumer.close()
    })
    await app.listen({ port: env.PORT })
    const shutdown = async () => {
      await emailQueueConsumer.close()
      await app.close()
      process.exit(0)
    }
    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
