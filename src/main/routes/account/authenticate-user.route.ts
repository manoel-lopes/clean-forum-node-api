import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { makeAuthenticateUserController } from '@/main/factories/controllers/authenticate-user'
import { adaptRoute } from '@/util/adapt-route'
import {
  authenticateUserSchema
} from '@/external/zod/application/schemas/account/authenticate-user.schema'
import {
  authenticateUserResponsesSchema
} from '@/external/zod/application/schemas/account/authenticate-user-responses.schema'

export function authenticateUserRoute (app: HttpServer) {
  app.post(
    '/account/auth',
    {
      schema: {
        tags: ['Account'],
        request: {
          body: authenticateUserSchema,
        },
        response: authenticateUserResponsesSchema,
      },
    },
    adaptRoute(makeAuthenticateUserController())
  )
}
