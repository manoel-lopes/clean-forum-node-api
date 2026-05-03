import type { FastifyInstance } from 'fastify'
import { deleteAccountResponsesSchema } from '@/infra/presentation/controllers/delete-account/schemas/delete-account.protocol'
import { makeDeleteAccountController } from '@/main/factories/delete-account'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteAccountRoute (app: FastifyInstance, tags: string[]) {
  app.delete(
    '/',
    {
      schema: {
        tags,
        description: 'Delete a user account',
        response: deleteAccountResponsesSchema,
      },
    },
    adaptRoute(makeDeleteAccountController())
  )
}
