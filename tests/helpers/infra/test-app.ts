import http from 'node:http'
import https from 'node:https'
import type { FastifyInstance } from 'fastify'
import { appFactory } from '@/main/fastify/app'
import { answersRoutes } from '@/main/fastify/routes/answers.routes'
import { commentsRoutes } from '@/main/fastify/routes/comments.routes'
import { questionsRoutes } from '@/main/fastify/routes/questions.routes'
import { sessionRoutes } from '@/main/fastify/routes/session.routes'
import { usersRoutes } from '@/main/fastify/routes/users.routes'

// Increase max sockets and configure agents for concurrent requests in tests
http.globalAgent.maxSockets = Infinity
http.globalAgent.maxFreeSockets = 256
https.globalAgent.maxSockets = Infinity
https.globalAgent.maxFreeSockets = 256

async function buildTestApp (): Promise<{ app: FastifyInstance }> {
  const app = await appFactory()
  // Configure server for high concurrency in tests
  app.server.maxHeadersCount = 2000
  app.server.timeout = 0
  app.server.keepAliveTimeout = 5000
  app.server.headersTimeout = 6000

  app.register(usersRoutes)
  app.register(sessionRoutes)
  app.register(questionsRoutes)
  app.register(answersRoutes)
  app.register(commentsRoutes)
  await app.ready()
  return { app }
}

export const { app } = await buildTestApp()
