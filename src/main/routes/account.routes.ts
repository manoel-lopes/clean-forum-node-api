import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { createAccountRoute } from './account/create-account.route'
import { authenticateUserRoute } from './account/authenticate-user.route'

export function accountRoutes (app: HttpServer) {
  app.register(createAccountRoute)
  app.register(authenticateUserRoute)
}
