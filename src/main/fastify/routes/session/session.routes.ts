import type { FastifyInstance } from 'fastify'
import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'
import { refreshTokenRoute } from './refresh-access-token/refresh-token.route'

export async function sessionRoutes (app: FastifyInstance) {
  app.register(authenticateUserRoute)
  app.register(refreshTokenRoute)
}
