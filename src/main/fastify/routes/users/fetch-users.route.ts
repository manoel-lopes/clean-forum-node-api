import type { FastifyInstance } from 'fastify'
import { fetchUsersResponsesSchemas } from '@/infra/presentation/controllers/fetch-users/schemas/fetch-users.protocol'
import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { makeFetchUsersController } from '@/main/factories/fetch-users'
import { adaptRoute } from '@/shared/util/http/adapt-route'
import { readOperationsRateLimit } from '../../plugins/rate-limit'

export async function fetchUsersRoute (app: FastifyInstance, tags: string[]) {
  app.get(
    '',
    {
      schema: {
        tags,
        description: 'Fetch a list of users',
        querystring: paginationParamsSchema,
        response: fetchUsersResponsesSchemas,
      },
      config: {
        rateLimit: readOperationsRateLimit(),
      },
    },
    adaptRoute(makeFetchUsersController())
  )
}
