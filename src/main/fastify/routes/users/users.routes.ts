import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'
import { createAccountRoute } from './create-account/create-account.route'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import type { FastifyInstance } from 'fastify'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [createAccountRoute, authenticateUserRoute])
}
