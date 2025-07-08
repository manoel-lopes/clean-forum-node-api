import type { FastifyInstance } from 'fastify'

import { createAccountSchema } from '@/infra/validation/zod/schemas/presentation/users/create-account.schemas'

import { makeCreateAccountController } from '@/main/factories/create-account'

import { adaptRoute } from '@/util/adapt-route'

export async function createAccountRoute (app: FastifyInstance, tags: string[]) {
  app.post('', {
    schema: {
      tags,
      description: 'Create a new user account',
      body: createAccountSchema.body,
      // response: createAccountResponsesSchema
    }
  },
  adaptRoute(makeCreateAccountController())
  )
}
