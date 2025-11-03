import http from 'node:http'
import https from 'node:https'
import { EmailQueueConsumer } from '@/infra/queues/email/email-queue.consumer'
import { env } from '@/lib/env'
import { appFactory } from './fastify/app'
import { answersRoutes } from './fastify/routes/answers.routes'
import { commentsRoutes } from './fastify/routes/comments.routes'
import { questionsRoutes } from './fastify/routes/questions.routes'
import { sessionRoutes } from './fastify/routes/session.routes'
import { usersRoutes } from './fastify/routes/users.routes'

http.globalAgent.maxSockets = Infinity
http.globalAgent.maxFreeSockets = 256
https.globalAgent.maxSockets = Infinity
https.globalAgent.maxFreeSockets = 256

async function buildApp () {
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
  app.server.maxHeadersCount = 2000
  app.server.timeout = 0
  app.server.keepAliveTimeout = 5000
  app.server.headersTimeout = 6000
  const emailQueueConsumer = new EmailQueueConsumer(app)
  app.register(usersRoutes)
  app.register(sessionRoutes)
  app.register(questionsRoutes)
  app.register(answersRoutes)
  app.register(commentsRoutes)
  app.addHook('onClose', async () => {
    await emailQueueConsumer.close()
  })
  await app.ready()
  return app
}

async function bootstrap () {
  try {
    const app = await buildApp()
    await app.listen({ port: env.PORT })
    const shutdown = async () => {
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

export const app = await buildApp()

if (process.env.NODE_ENV !== 'test') {
  bootstrap()
}
