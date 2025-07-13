import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { createAccountRoute } from './create-account/create-account.route'
import { deleteAccountRoute } from './delete-account/delete-account.route'
import { fetchUsersRoute } from './fetch-users/fetch-users.route'
import { getUserByEmailRoute } from './get-user-by-email/get-user-by-email.route'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createAccountRoute,
    getUserByEmailRoute,
    deleteAccountRoute,
    fetchUsersRoute
  ])
}
