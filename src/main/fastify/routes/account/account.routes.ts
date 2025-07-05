import type { FastifyInstance } from 'fastify'

import { createAccountRoute } from './create-account/create-account.route'
import { authenticateUserRoute } from './authenticate-user/authenticate-user.route'

export async function accountRoutes(app: FastifyInstance) {
  const tags = ['Account']
  app.register(
    async (app) => {
      await createAccountRoute(app, tags)
      await authenticateUserRoute(app, tags)
    },
    { prefix: '/accounts' },
  )
}
