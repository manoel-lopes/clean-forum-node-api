import type { FastifyInstance } from 'fastify'
import {
  deleteAccountResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/users/delete-account.schemas'
import { makeDeleteAccountController } from '@/main/factories/delete-account'
import { adaptRoute } from '@/util/adapt-route'
import { userCreationRateLimit } from '../../plugins/rate-limit'

export async function deleteAccountRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/', {
    schema: {
      tags,
      description: 'Delete a user account',
      response: deleteAccountResponsesSchema
    },
    config: {
      rateLimit: userCreationRateLimit()
    }
  },
  adaptRoute(makeDeleteAccountController())
  )
}
