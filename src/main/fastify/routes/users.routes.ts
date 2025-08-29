import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '@/main/fastify/middlewares/ensure-authenticated'
import { createAccountRoute } from './users/create-account.route'
import { deleteAccountRoute } from './users/delete-account.route'
import { fetchUsersRoute } from './users/fetch-users.route'
import { getUserByEmailRoute } from './users/get-user-by-email.route'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [createAccountRoute])
  registerRoutes(app, [
    getUserByEmailRoute,
    deleteAccountRoute,
    fetchUsersRoute
  ], {
    preHandler: [ensureAuthenticated]
  })
}
