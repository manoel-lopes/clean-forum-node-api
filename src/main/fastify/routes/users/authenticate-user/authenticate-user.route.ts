import type { FastifyInstance } from 'fastify'

import { authenticateUserSchema } from '@/external/zod/application/schemas/account/authenticate-user.schema'
import { authenticateUserResponsesSchema } from '@/external/zod/application/schemas/account/authenticate-user-responses.schema'

import { makeAuthenticateUserController } from '@/main/factories/controllers/authenticate-user'

import { adaptRoute } from '@/util/adapt-route'

export async function authenticateUserRoute (app: FastifyInstance, tags: string[]) {
  app.post('/auth', {
    schema: {
      tags,
      description: 'Authenticate a user',
      body: authenticateUserSchema,
      response: authenticateUserResponsesSchema
    }
  },
  adaptRoute(makeAuthenticateUserController())
  )
}
