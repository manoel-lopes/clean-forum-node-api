import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { makeCreateAccountController } from '@/main/factories/controllers/create-account'
import { adaptRoute } from '@/util/adapt-route'
import { createAccountSchema } from '@/external/zod/application/schemas/account/create-account.schema'
import {
  createAccountResponsesSchema
} from '@/external/zod/application/schemas/account/create-account-responses.schema'

export function createAccountRoute (app: HttpServer) {
  app.post(
    '/account',
    {
      schema: {
        tags: ['Account'],
        request: {
          body: createAccountSchema,
        },
        response: createAccountResponsesSchema,
      },
    },
    adaptRoute(makeCreateAccountController())
  )
}
