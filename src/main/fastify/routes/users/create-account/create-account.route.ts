import type { FastifyInstance } from 'fastify'

import { createAccountSchema } from '@/external/zod/application/schemas/account/create-account.schema'
import { createAccountResponsesSchema } from '@/external/zod/application/schemas/account/create-account-responses.schema'

import { makeCreateAccountController } from '@/main/factories/controllers/create-account'

import { adaptRoute } from '@/util/adapt-route'

export async function createAccountRoute (app: FastifyInstance, tags: string[]) {
  app.post('', {
    schema: {
      tags,
      description: 'Create a new user account',
      body: createAccountSchema,
      response: createAccountResponsesSchema
    }
  },
  adaptRoute(makeCreateAccountController())
  )
}
