import type { FastifyInstance } from 'fastify'

import { authenticateUserSchema } from '@/infra/validation/zod/schemas/presentation/users/authenticate-user.schema'
import { authenticateUserResponsesSchema } from '@/infra/validation/zod/schemas/presentation/users/authenticate-user-responses.schema'

import { makeAuthenticateUserController } from '@/main/factories/authenticate-user'

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
