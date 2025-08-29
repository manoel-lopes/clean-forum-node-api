import type { FastifyInstance } from 'fastify'
import { authenticateUserRoute } from './session/authenticate-user.route'
import { refreshTokenRoute } from './session/refresh-token.route'

export async function sessionRoutes (app: FastifyInstance) {
  app.register(async (scoped) => {
    const tags = ['Auth']
    await authenticateUserRoute(scoped, tags)
    await refreshTokenRoute(scoped, tags)
  }, { prefix: '/auth' })
}
