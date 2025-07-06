import type { FastifyInstance } from 'fastify'

import { makeGetUserByEmailController } from '@/main/factories/get-user-by-email'
import { getUserByEmailSchema } from '@/infra/validation/zod/schemas/presentation/users/get-user-by-email.schema'
import { getUserByEmailResponsesSchema } from '@/infra/validation/zod/schemas/presentation/users/get-user-by-email-responses.schema'

import { adaptRoute } from '@/util/adapt-route'

export async function getUserByEmailRoute (app: FastifyInstance, tags: string[]) {
  app.get('/users/:email', {
    schema: {
      tags,
      description: 'Get user by email',
      params: getUserByEmailSchema,
      response: getUserByEmailResponsesSchema
    }
  },
  adaptRoute(makeGetUserByEmailController())
  )
}
