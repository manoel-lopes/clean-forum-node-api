import type { FastifyInstance } from 'fastify'

import {
  deleteAccountParamsSchema,
  deleteAccountResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/users/delete-account.schemas'

import { makeDeleteAccountController } from '@/main/factories/delete-account'

import { adaptRoute } from '@/util/adapt-route'

export async function deleteAccountRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/:userId', {
    schema: {
      tags,
      description: 'Delete a user account',
      params: deleteAccountParamsSchema,
      response: deleteAccountResponsesSchema
    }
  },
  adaptRoute(makeDeleteAccountController())
  )
}
