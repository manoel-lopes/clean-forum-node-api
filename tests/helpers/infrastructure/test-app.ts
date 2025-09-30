import type { FastifyInstance } from 'fastify'
import { appFactory } from '@/main/fastify/app'
import { answersRoutes } from '@/main/fastify/routes/answers.routes'
import { commentsRoutes } from '@/main/fastify/routes/comments.routes'
import { questionsRoutes } from '@/main/fastify/routes/questions.routes'
import { sessionRoutes } from '@/main/fastify/routes/session.routes'
import { usersRoutes } from '@/main/fastify/routes/users.routes'

async function buildTestApp (): Promise<{ app: FastifyInstance }> {
  const app = await appFactory()
  app.register(usersRoutes)
  app.register(sessionRoutes)
  app.register(questionsRoutes)
  app.register(answersRoutes)
  app.register(commentsRoutes)
  await app.ready()
  return { app }
}

export const { app } = await buildTestApp()
