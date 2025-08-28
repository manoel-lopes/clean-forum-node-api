import type { FastifyInstance } from 'fastify'
import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'
import { refreshTokenRoute } from './refresh-access-token/refresh-token.route'

export async function sessionRoutes (app: FastifyInstance) {
  app.register(async (scoped) => {
    const tags = ['Auth']
    await authenticateUserRoute(scoped, tags)
    await refreshTokenRoute(scoped, tags)
  }, { prefix: '/auth' })
}
