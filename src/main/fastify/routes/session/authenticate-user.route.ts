import type { FastifyInstance } from 'fastify'
import { authenticateUserBodySchema, authenticateUserResponsesSchema } from '@/infra/validation/zod/schemas/presentation/sessions/authenticate-user.schemas'
import { makeAuthenticateUserController } from '@/main/factories/authenticate-user'
import { adaptRoute } from '@/util/http/adapt-route'
import { authRateLimit } from '../../plugins/rate-limit'

export async function authenticateUserRoute (app: FastifyInstance, tags: string[]) {
  app.post('/', {
    schema: {
      tags,
      description: 'Authenticate a user',
      body: authenticateUserBodySchema,
      response: authenticateUserResponsesSchema
    },
    config: {
      rateLimit: authRateLimit()
    }
  },
  adaptRoute(makeAuthenticateUserController())
  )
}
