import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { createAccountRoute } from './create-account/create-account.route'

export function usersRoutes (app: HttpServer) {
  app.register(createAccountRoute)
}
