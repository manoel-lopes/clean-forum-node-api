import type { FastifyInstance } from 'fastify'

import { makeAuthenticateUserController } from '@/main/factories/controllers/authenticate-user'
import { adaptRoute } from '@/util/adapt-route'
import { authenticateUserSchema } from '@/external/zod/application/schemas/account/authenticate-user.schema'
import { authenticateUserResponsesSchema } from '@/external/zod/application/schemas/account/authenticate-user-responses.schema'
import { createRouteOptions } from '../../route-options'

export async function authenticateUserRoute(
  app: FastifyInstance,
  tags: string[],
) {
  app.post(
    '/auth',
    createRouteOptions({
      tags,
      schema: {
        body: authenticateUserSchema,
        response: authenticateUserResponsesSchema,
      },
    }),
    adaptRoute(makeAuthenticateUserController()),
  )
}
