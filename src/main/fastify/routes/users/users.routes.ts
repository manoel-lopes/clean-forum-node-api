import type { FastifyInstance } from 'fastify'

import { registerRoutes } from '@/main/fastify/helpers/register-routes'

import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'
import { createAccountRoute } from './create-account/create-account.route'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [createAccountRoute, authenticateUserRoute])
}
