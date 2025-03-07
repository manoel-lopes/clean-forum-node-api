import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import {
  createAccountRequestSchema,
} from '@/external/zod/application/create-account/create-account-request.schema'
import {
  createAccountResponseSchema,
} from '@/external/zod/application/create-account/create-account-response.schema'
import { adaptRoute } from '@/util/adapt-route'
import { makeCreateAccountController } from '@/main/factories/make-create-account-controller'

export function createAccountRoute (app: HttpServer) {
  app.post('/account', {
    schema: {
      tags: ['Users'],
      description: 'Create a new user account',
      request: createAccountRequestSchema,
      response: createAccountResponseSchema,
    },
  }, adaptRoute(makeCreateAccountController()))
}
