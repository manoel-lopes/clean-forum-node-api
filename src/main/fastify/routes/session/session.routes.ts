import type { FastifyInstance } from 'fastify'
import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'
import { refreshAccessTokenRoute } from './refresh-access-token/refresh-access-token.route'

export async function sessionRoutes (app: FastifyInstance) {
  app.register(authenticateUserRoute)
  app.register(refreshAccessTokenRoute)
}
