import type { FastifyInstance } from 'fastify'
import { authenticateUserBodySchema, authenticateUserResponsesSchema } from '@/infra/validation/zod/schemas/presentation/sessions/authenticate-user.schemas'
import { makeAuthenticateUserController } from '@/main/factories/authenticate-user'
import { adaptRoute } from '@/util/adapt-route'

export async function authenticateUserRoute (app: FastifyInstance, tags: string[]) {
  app.post('/', {
    schema: {
      tags,
      description: 'Authenticate a user',
      body: authenticateUserBodySchema,
      response: authenticateUserResponsesSchema
    }
  },
  adaptRoute(makeAuthenticateUserController())
  )
}
