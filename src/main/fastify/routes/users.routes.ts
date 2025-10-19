import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '@/main/fastify/middlewares/ensure-authenticated'
import { createAccountRoute } from './users/create-account.route'
import { deleteAccountRoute } from './users/delete-account.route'
import { fetchUserQuestionsRoute } from './users/fetch-user-questions.route'
import { fetchUsersRoute } from './users/fetch-users.route'
import { getUserByEmailRoute } from './users/get-user-by-email.route'
import { sendEmailValidationRoute } from './users/send-email-validation.route'
import { verifyEmailValidationRoute } from './users/verify-email-validation.route'

export async function usersRoutes (app: FastifyInstance) {
  registerRoutes(app, [createAccountRoute, sendEmailValidationRoute, verifyEmailValidationRoute])
  registerRoutes(app, [getUserByEmailRoute, deleteAccountRoute, fetchUsersRoute, fetchUserQuestionsRoute], {
    preHandler: [ensureAuthenticated],
  })
}
