import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '@/main/fastify/middlewares/ensure-authenticated'
import { sendEmailValidationRoute } from './send-email-validation.route'
import { createAccountRoute } from './users/create-account.route'
import { deleteAccountRoute } from './users/delete-account.route'
import { fetchUsersRoute } from './users/fetch-users.route'
import { getUserByEmailRoute } from './users/get-user-by-email.route'
import { verifyEmailValidationRoute } from './users/verify-email-validation.route'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createAccountRoute,
    verifyEmailValidationRoute
  ])
  registerRoutes(app, [
    getUserByEmailRoute,
    deleteAccountRoute,
    fetchUsersRoute
  ], {
    preHandler: [ensureAuthenticated]
  })

  // Register send email validation separately due to different API
  await sendEmailValidationRoute(app)
}
