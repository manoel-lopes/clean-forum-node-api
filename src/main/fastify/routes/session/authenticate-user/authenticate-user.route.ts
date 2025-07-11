import type { FastifyInstance } from 'fastify'

import { authenticateUserBodySchema, authenticateUserResponsesSchema } from '@/infra/validation/zod/schemas/presentation/users/authenticate-user.schemas'

import { makeAuthenticateUserController } from '@/main/factories/authenticate-user'

import { adaptRoute } from '@/util/adapt-route'

export async function authenticateUserRoute (app: FastifyInstance) {
  app.post('/auth', {
    schema: {
      tags: ['Sessions'],
      description: 'Authenticate a user',
      body: authenticateUserBodySchema,
      response: authenticateUserResponsesSchema
    }
  },
  adaptRoute(makeAuthenticateUserController())
  )
}
