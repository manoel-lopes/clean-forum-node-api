import type { FastifyInstance } from 'fastify'
import {
  refreshTokenBodySchema,
  refreshTokenResponseSchema,
} from '@/infra/validation/zod/schemas/presentation/sessions/refresh-tokens.schemas'
import { makeRefreshAccessTokenController } from '@/main/factories/refresh-access-token'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function refreshTokenRoute(app: FastifyInstance, tags: string[]) {
  app.post(
    '/refresh-token',
    {
      schema: {
        tags,
        description: 'Refresh access token',
        body: refreshTokenBodySchema,
        response: refreshTokenResponseSchema,
      },
    },
    adaptRoute(makeRefreshAccessTokenController()),
  )
}
