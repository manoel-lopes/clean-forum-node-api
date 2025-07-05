import type { FastifyInstance } from 'fastify'

import { createAccountRoute } from './create-account/create-account.route'
import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [createAccountRoute, authenticateUserRoute])
}
