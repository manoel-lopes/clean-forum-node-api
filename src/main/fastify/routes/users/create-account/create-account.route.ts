import type { FastifyInstance } from 'fastify'

import { makeCreateAccountController } from '@/main/factories/create-account'
import { createAccountSchema } from '@/main/zod/schemas/presentation/users/create-account.schema'
import { createAccountResponsesSchema } from '@/main/zod/schemas/presentation/users/create-account-responses.schema'

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
