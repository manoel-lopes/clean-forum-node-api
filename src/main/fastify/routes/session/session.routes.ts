import type { FastifyInstance } from 'fastify'
import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'

export async function sessionRoutes (app: FastifyInstance) {
  app.register(authenticateUserRoute)
}
