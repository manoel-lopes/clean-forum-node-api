import type { FastifyInstance } from 'fastify'

import {
  createAccountBodySchema,
  createAccountResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/users/create-account.schemas'

import { makeCreateAccountController } from '@/main/factories/create-account'

import { adaptRoute } from '@/util/adapt-route'

export async function createAccountRoute (app: FastifyInstance, tags: string[]) {
  app.post('', {
    schema: {
      tags,
      description: 'Create a new user account',
      body: createAccountBodySchema,
      response: createAccountResponsesSchema
    }
  },
  adaptRoute(makeCreateAccountController())
  )
}
